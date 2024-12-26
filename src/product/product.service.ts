import { Injectable, Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  create(createProduct: Product): Promise<Product> {
    return this.productModel.create(createProduct);
  }

  public async findAll({ query, limit = 20, offset = 0 }: { query?: mongoose.FilterQuery<Product>, limit?: number, offset?: number } = {}) {
    const data = await this.productModel
      .find(query)
      .limit(limit)
      .skip(offset);
    const count = await this.productModel.countDocuments(query);
    return { count, data };
  }

  public findOne(id: string): Promise<Product> {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    return this.productModel.findById(id);
  }

  public update(id: string, updateProduct: Product) {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    return this.productModel.updateOne({ id }, updateProduct);
  }

  public remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    return this.productModel.deleteOne({ id });
  }

  public async importBatch(importingRef: mongoose.Schema.Types.ObjectId, rows: unknown[], fileName: string) {
    await Promise.all(rows.map((row) => {
      this.importRow(importingRef, row, fileName);
    }));
  }

  private async importRow(importingRef: mongoose.Schema.Types.ObjectId, row: unknown, fileName: string) {
    const raw: Product = row as Product;
    const found = await this.findAll({ query: { code: raw.code }});
    if (raw.code && raw.product_name && found.count === 0) {
      const product = new this.productModel({
        ...raw,
        imported_t: new Date(),
        importing_ref: importingRef,
        status: 'published',
        file_name: fileName,
      });

      await this.create(product);
      this.logger.log(`Product ${product.code} has been added`);
    }
  }
}
