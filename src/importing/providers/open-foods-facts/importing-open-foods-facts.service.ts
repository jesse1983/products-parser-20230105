import { Injectable, Logger } from '@nestjs/common';
import { IImportingService } from '../Iimporting.service';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { mkdir } from "fs/promises";
import * as zlib from 'node:zlib';
import { ImportingRepository } from 'src/importing/importing.repository';
import { ProductService } from 'src/product/product.service';
import mongoose from 'mongoose';

const LineByLineReader = require('line-by-line');

@Injectable()
export class ImportingOpenFoodsFacts implements IImportingService {

    private readonly logger = new Logger(ImportingOpenFoodsFacts.name);

    private readonly MAX_ROWS = 100;

    constructor(
        private readonly importingRepository: ImportingRepository,
        private readonly productService: ProductService,
    ) {}

    public async execute() {
        this.logger.log('Execute OpenFoodsFacts');
        const dataList = await this.getDataListFromSource();

        for (const fileName of dataList) {
            const found = await this.importingRepository.getOneByFileName(fileName);
            if (fileName && !found) {
                const document = await this.importingRepository.create({ fileName, status: 'WIP' });
                try {
                    await this.clearFiles(fileName);

                    const gzPath = await this.downloadZip(fileName);
                    const jsonPath = await this.extractJsonFromZip(gzPath);
                    const minJsonPath = await this.getFirstLines(jsonPath, jsonPath.replace('.json', '.min.json'));
                    const rows = JSON.parse(fs.readFileSync(minJsonPath, 'utf-8').replace(']]', ']'))
                    await this.importData(document.id, rows, fileName);

                    document.status = 'DONE';
                    document.save();
                } finally {
                    setTimeout(() => this.clearFiles(fileName), 1000);
                }
            }
        }
    }

    private async getDataListFromSource(): Promise<string[]> {
        const result = await fetch('https://challenges.coode.sh/food/data/json/index.txt');
        const text = await result.text();
        return text.split('\n');
    }

    private async downloadZip(fileName: string): Promise<string> {
        const url = `https://challenges.coode.sh/food/data/json/${fileName}`;
        const downloadDir = path.resolve("./downloads");
        const destination = path.join(downloadDir, fileName);
    
        // Criar diretório "downloads" se não existir
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
        const jsonPath = filePath.replace('.gz', '');
        return new Promise((resolve, reject) => {
          const gunzip = zlib.createGunzip();
          fs.appendFileSync(jsonPath, '[\n');
      
          fs.createReadStream(filePath)
            .pipe(gunzip)
            .on('data', (chunk) => {
              const buf = Buffer.from(chunk);        
              fs.appendFileSync(jsonPath, buf.toString('utf8'));
            })
            .on('end', () => {
              this.logger.log(`Finish json file ${filePath}`);
              resolve(jsonPath);
            });
        });
    }

    private async getFirstLines(inputFile: string, outputFile: string): Promise<string> {
        return new Promise((resolve) => {
            const rl = new LineByLineReader(inputFile);

            const outputStream = fs.createWriteStream(outputFile);
    
            let lineCount = 0;
            rl.on('line', (line) => {
                if (lineCount <= this.MAX_ROWS) {
                    const comma = lineCount < this.MAX_ROWS && lineCount > 0  ? ',' : '';
                    outputStream.write(line + comma + "\n");
                    lineCount += 1;
                } else {
                    outputStream.write(']', () => {
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
        const [startName] = fileName.split('.');
        const files = fs.readdirSync('./downloads').filter(fn => fn.startsWith(startName));
        for (const file of files) fs.unlinkSync('./downloads/' + file);
    }

    private async importData(importingRef: mongoose.Schema.Types.ObjectId, rows: unknown[], fileName: string) {
        await this.productService.importBatch(importingRef, rows, fileName);
    }
}
