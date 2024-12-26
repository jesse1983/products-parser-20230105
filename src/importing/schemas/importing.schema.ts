import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImportingDocument = HydratedDocument<Importing>;

@Schema({ timestamps: true })
export class Importing {
  @Prop({ enum: ['WIP', 'DONE', 'FAILED'], default: 'WIP', required: true })
  status: string;

  @Prop({ required: true })
  fileName: string;     
}

export const ImportingSchema = SchemaFactory.createForClass(Importing);