import { Injectable, Logger } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  create(createProduct: Product): Promise<ProductDocument> {
    return this.productModel.create(createProduct);
  }

  public async findAll({
    query,
    limit,
    offset,
  }: {
    query?: mongoose.FilterQuery<Product>;
    limit?: number;
    offset?: number;
  }) {
    const data = await this.productModel.find(query).limit(limit).skip(offset);
    const count = await this.productModel.countDocuments(query);
    return { count, data };
  }

  public findOne(id: string): Promise<Product> {
    if (!mongoose.Types.ObjectId.isValid(id)) return;
    return this.productModel.findById(id);
  }

  public async update(id: string, updateProduct: unknown) {
    await this.productModel.updateOne({ _id: id }, updateProduct);
    return this.findOne(id);
  }

  public remove(id: string) {
    return this.productModel.deleteOne({ id });
  }

  public removeAll() {
    return this.productModel.deleteMany();
  }
}
