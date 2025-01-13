import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { DEFAULT_PAGE_SIZE } from 'src/constants/constant';

@Injectable()
export class ProductService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          console.log('Upload Error:', error);
          reject(error); // Reject the promise on error
        } else {
          console.log('Upload Success:', result);
          resolve(result); // Resolve the promise on success
        }
      });
      // Pipe the file buffer to the upload stream
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(upload);
    });
  }
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  
  async create(productDto: CreateProductDto): Promise<Product> {
    
    const product = await this.productRepository.create(productDto);
    const data = await this.productRepository.save(product);
    return data;
  }

  async findAll(paginationDto:PaginationDto): Promise< Product[] > {
    const products = await this.productRepository.find({
      skip:paginationDto.skip,
      take:paginationDto.limit ?? DEFAULT_PAGE_SIZE
    });
    // console.log(products)

    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }

    return products
  }

  async findOne(id: number): Promise< Product> {
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
   return data;
  }

  async delete(id: number): Promise<number> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
      await this.productRepository.delete(id);
    return product.id
    
  }
}
