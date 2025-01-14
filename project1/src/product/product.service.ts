import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/constants/constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  async create(productDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.create(productDto);
    const data = await this.productRepository.save(product);
    return data;
  }

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    const { search, skipPagination } = paginationDto;
    let { skip, limit } = paginationDto;
    limit = DEFAULT_PAGE_SIZE;
    const where: any = {};
    if (search?.name) {
      where.productName = Like(`%${search.name}%`);
    }
    if (search?.price) {
      where.price = search.price;
    }
    if (skipPagination) {
      skip = null;
      limit = null;
    }
    console.log('Where condition:', where);

    const products = await this.productRepository.find({
      where,
      skip: skip,
      take: limit,
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }
    if (skipPagination) {
      const cachedData: Product[] =
        await this.cacheManager.get('cachedProducts');
      if (cachedData) {
        return cachedData;
      }
      await this.cacheManager.set('cachedProducts', products);
    }
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const updatedProductEntity = { ...product, ...updateProductDto };
    const data = await this.productRepository.save(updatedProductEntity);
    await this.cacheManager.del('cachedProducts');
    return data;
  }

  async delete(id: number): Promise<number> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.delete(id);
    await this.cacheManager.del('cachedProducts');
    return product.id;
  }
}
