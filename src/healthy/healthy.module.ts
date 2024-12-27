import { Module } from "@nestjs/common";
import { HealthyController } from "./healthy.controller";
import { HealthyService } from "./healthy.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  ImportingProcess,
  ImportingProcessSchema,
} from "../importing/schemas/importing-process.schema";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: ImportingProcess.name, schema: ImportingProcessSchema },
    ]),
  ],
  controllers: [HealthyController],
  providers: [HealthyService],
})
export class HealthyModule {}
