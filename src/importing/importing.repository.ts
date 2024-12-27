import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Importing } from "./schemas/importing.schema";
import { Model } from "mongoose";

@Injectable()
export class ImportingRepository {
  constructor(
    @InjectModel(Importing.name) private importingModel: Model<Importing>,
  ) {}

  async create(body: Importing) {
    return this.importingModel.create(body);
  }

  async update(id: string, body: Importing) {
    return this.importingModel.updateOne(body, { id });
  }

  async getOneByFileName(fileName: string) {
    return this.importingModel.findOne({ fileName, status: "DONE" });
  }
}
