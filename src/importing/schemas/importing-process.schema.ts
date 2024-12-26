import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImportingProcessDocument = HydratedDocument<ImportingProcess>;

@Schema({ timestamps: true })
export class ImportingProcess {
  @Prop({ enum: ['WIP', 'DONE', 'FAILED'], default: 'WIP', required: true })
  status: string;

  @Prop()
  endDate: Date;

  @Prop()
  errorMessage: string;
}

export const ImportingProcessSchema = SchemaFactory.createForClass(ImportingProcess);