import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let fileName;
      if (file) {
        fileName = file.originalname;
      } else {
        fileName = 'default.jpg';
      }
      createProductDto.productImage = fileName;
      let imageUrl;
      if(file){
        const{url}:any = await this.productService.uploadImage(file);
        imageUrl = url;
      }
      const data = await this.productService.create(createProductDto);
      // console.log(data);
      return {
        message: 'Product created successfully',
        data:{
          ...data,
        image:imageUrl,
        }
        
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    const data = await this.productService.findAll();
    console.log(data)
    return {
      message: 'Products retrieved successfully',
      data,
  }
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.productService.findOne(id);
    return {
      message: 'Product retrieved successfully',
      data,
  }
}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productService.update(id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data,
      };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data= await this.productService.delete(id);
    return {
      message: 'Product deleted successfully',
      data
  }
}
}
