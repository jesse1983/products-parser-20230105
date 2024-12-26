import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';
import { ApiCreatedResponse, ApiQuery, ApiResponse } from '@nestjs/swagger';

type SearchProducts = {
  offset?: number;
  limit?: number;
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiCreatedResponse({ type: Product })
  create(@Body() createProduct: Product) {
    return this.productService.create(createProduct);
  }

  @Get()
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() search: SearchProducts) {
    return this.productService.findAll({ ...search });
  }

  @Get(':id')
  @ApiResponse({ type: Product })
  async findOne(@Param('id') id: string) {
    const found = await this.productService.findOne(id);
    if (!found) throw new NotFoundException('Not Found')
    return found;
  }

  @Put(':id')
  @ApiResponse({ type: Product })
  update(@Param('id') id: string, @Body() updateProduct: Product) {
    return this.productService.update(id, updateProduct);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
