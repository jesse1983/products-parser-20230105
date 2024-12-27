import { Injectable, Logger } from "@nestjs/common";
import { IImportingService } from "../Iimporting.service";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { mkdir } from "fs/promises";
import * as zlib from "node:zlib";
import { ImportingRepository } from "../../../importing/importing.repository";
import { ProductService } from "../../../product/product.service";
import mongoose from "mongoose";
import { ConfigService } from "@nestjs/config";
import { Product } from "src/product/schemas/product.schema";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const LineByLineReader = require("line-by-line");

@Injectable()
export class ImportingOpenFoodsFacts implements IImportingService {
  private readonly logger = new Logger(ImportingOpenFoodsFacts.name);

  private readonly DOWNLOAD_PATH = "./downloads";

  constructor(
    private readonly configService: ConfigService,
    private readonly importingRepository: ImportingRepository,
    private readonly productService: ProductService,
  ) {}

  public async execute() {
    this.logger.log("Execute OpenFoodsFacts");
    const dataList = await this.getDataListFromSource();

    for (const fileName of dataList) {
      const found = await this.importingRepository.getOneByFileName(fileName);
      if (fileName && !found) {
        const document = await this.importingRepository.create({
          fileName,
          status: "WIP",
        });
        try {
          await this.clearFiles(fileName);

          const gzPath = await this.downloadZip(fileName);
          const jsonPath = await this.extractJsonFromZip(gzPath);
          const minJsonPath = await this.getFirstLines(
            jsonPath,
            jsonPath.replace(".json", ".min.json"),
          );
          const rows = JSON.parse(
            fs.readFileSync(minJsonPath, "utf-8").replace("]]", "]"),
          );
          await this.importData(document.id, rows, fileName);

          document.status = "DONE";
          document.save();
        } finally {
          setTimeout(() => this.clearFiles(fileName), 1000);
        }
      }
    }
  }

  private async getDataListFromSource(): Promise<string[]> {
    const result = await fetch(
      this.configService.get<string>("OPEN_FOODS_FILES_URL"),
    );
    const text = await result.text();
    return text.split("\n");
  }

  private async downloadZip(fileName: string): Promise<string> {
    const url = `${this.configService.get<string>("OPEN_FOODS_JSON_URL")}${fileName}`;
    const downloadDir = path.resolve(this.DOWNLOAD_PATH);
    const destination = path.join(downloadDir, fileName);

    if (!fs.existsSync(downloadDir)) {
      await mkdir(downloadDir, { recursive: true });
    }
    return new Promise((resolve) => {
      const file = fs.createWriteStream(destination);
      https.get(url, (response) => {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
          file.close();
          this.logger.log(`Download ${fileName} completed`);
          resolve(destination);
        });
      });
    });
  }

  private async extractJsonFromZip(filePath): Promise<string> {
    const jsonPath = filePath.replace(".gz", "");
    return new Promise((resolve) => {
      const gunzip = zlib.createGunzip();
      fs.appendFileSync(jsonPath, "[\n");

      fs.createReadStream(filePath)
        .pipe(gunzip)
        .on("data", (chunk) => {
          const buf = Buffer.from(chunk);
          fs.appendFileSync(jsonPath, buf.toString("utf8"));
        })
        .on("end", () => {
          this.logger.log(`Finish json file ${filePath}`);
          resolve(jsonPath);
        });
    });
  }

  private async getFirstLines(
    inputFile: string,
    outputFile: string,
  ): Promise<string> {
    return new Promise((resolve) => {
      const rl = new LineByLineReader(inputFile);
      const maxRows = this.configService.get<number>("OPEN_FOODS_MAX_ROWS");

      const outputStream = fs.createWriteStream(outputFile);

      let lineCount = 0;
      rl.on("line", (line) => {
        if (lineCount <= maxRows) {
          const comma = lineCount < maxRows && lineCount > 0 ? "," : "";
          outputStream.write(line + comma + "\n");
          lineCount += 1;
        } else {
          outputStream.write("]", () => {
            outputStream.end();
            resolve(outputFile);
          });
          rl.close();
          return;
        }
      });
    });
  }

  private async clearFiles(fileName: string) {
    const [startName] = fileName.split(".");
    const files = fs
      .readdirSync(this.DOWNLOAD_PATH)
      .filter((fn) => fn.startsWith(startName));
    for (const file of files) fs.unlinkSync(this.DOWNLOAD_PATH + "/" + file);
  }

  private async importData(
    importingRef: mongoose.Schema.Types.ObjectId,
    rows: unknown[],
    fileName: string,
  ) {
    await this.importBatch(importingRef, rows, fileName);
  }

  private async importBatch(
    importingRef: mongoose.Schema.Types.ObjectId,
    rows: unknown[],
    fileName: string,
  ) {
    await Promise.all(
      rows.map((row) => {
        this.importRow(importingRef, row, fileName);
      }),
    );
  }

  private async importRow(
    importingRef: mongoose.Schema.Types.ObjectId,
    row: unknown,
    fileName: string,
  ) {
    const raw: Product = row as Product;
    const found = await this.productService.findAll({
      query: { code: raw.code },
    });
    if (raw.code && raw.product_name && found.count === 0) {
      const product = {
        ...raw,
        imported_t: new Date(),
        importing_ref: importingRef,
        status: "published",
        file_name: fileName,
      };

      await this.productService.create(product);
      this.logger.log(`Product ${product.code} has been added`);
    }
  }
}
