import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
