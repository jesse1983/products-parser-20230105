import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @ApiProperty({ example: '676d1f031f8fa13b5799818d' })
  importing_ref: mongoose.Schema.Types.ObjectId;

  @ApiProperty({ example: '20221126' })
  @Prop({ required: true })
  code: string;

  @ApiProperty({ example: 'file-name.json' })
  @Prop({ required: true })
  file_name: string;

  @ApiProperty({ example: 'published' })
  @Prop({ required: true })
  status: string;

  @ApiProperty({ example: '2020-02-07T16:00:00Z' })
  @Prop({ required: true })
  imported_t: Date;

  @ApiProperty({ example: 'https://world.openfoodfacts.org/product/20221126' })
  @Prop({ required: true })
  url: string;

  @ApiProperty({ example: 'securita' })
  @Prop({ required: true })
  creator: string;

  @ApiProperty({ example: 1415302075 })
  @Prop({ required: true })
  created_t: number;

  @ApiProperty({ example: 1572265837 })
  @Prop({ required: true })
  last_modified_t: number;

  @ApiProperty({ example: 'Madalenas quadradas' })
  @Prop({ required: true })
  product_name: string;

  @ApiProperty({ example: '380 g (6 x 2 u.)' })
  @Prop()
  quantity?: string;

  @ApiProperty({ example: 'La Cestera' })
  @Prop()
  brands?: string;

  @ApiProperty({ example: 'Lanches comida, Lanches doces, Biscoitos e Bolos, Bolos, Madalenas' })
  @Prop()
  categories?: string;

  @ApiProperty({ example: 'Contem gluten, Contém derivados de ovos, Contém ovos' })
  @Prop()
  labels?: string;

  @ApiProperty({ example: '' })
  @Prop()
  cities?: string;

  @ApiProperty({ example: 'Braga,Portugal' })
  @Prop()
  purchase_places?: string;

  @ApiProperty({ example: 'Lidl' })
  @Prop()
  stores?: string;

  @ApiProperty({ example:'farinha de trigo, açúcar, óleo vegetal de girassol' })
  @Prop()
  ingredients_text?: string;

  @ApiProperty({ example: 'Frutos de casca rija,Leite,Soja,Sementes de sésamo,Produtos à base de sementes de sésamo' })
  @Prop()
  traces?: string;

  @ApiProperty({ example: 'madalena 31.7 g' })
  @Prop()
  serving_size?: string;

  @ApiProperty({ example: 31.7 })
  @Prop()
  serving_quantity?: number;

  @ApiProperty({ example: 17 })
  @Prop()
  nutriscore_score?: number;

  @ApiProperty({ example: 'd' })
  @Prop()
  nutriscore_grade?: string;

  @ApiProperty({ example: 'en:madeleines' })
  @Prop()
  main_category?: string;

  @ApiProperty({ example: 'https://static.openfoodfacts.org/images/products/20221126/front_pt.5.400.jpg' })
  @Prop()
  image_url?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);