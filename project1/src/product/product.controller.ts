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
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { Roles } from 'src/custom/roles.decorator';
import { RolesGuard } from 'src/auth/rolesGuard';
import { ROLE } from 'src/database/entities/user.entity';
import { Public } from 'src/custom/public.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import {  PaginationDto } from './dto/pagination.dto';
import { TransformInterceptor } from 'src/interceptors/responseInterceptor';

@UseGuards(AuthGuard,RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Roles(ROLE.ADMIN)
  @Post('add')
  @ApiConsumes('multipart/form-data')
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request:AuthRequest,
  ) {

    console.log("productName",createProductDto.productName)
    try {
      let fileName;
      if (file) {
        fileName = file.originalname;
      } else {
        fileName = 'default.jpg';
      }
      createProductDto.userId=request.user.id 
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
  @Public()
  @UseInterceptors(TransformInterceptor)
  @Get()
  async findAll(@Query() paginationDto:PaginationDto) {
    const data = await this.productService.findAll(paginationDto);
    // console.log(data)
    return {
      message: 'Products retrieved successfully',
      ProductData:data,
  }
  }
@Public()
@UseInterceptors(TransformInterceptor)
  @Get(':id')

  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.productService.findOne(id);
    return {
      message: 'Product retrieved successfully',
      productData:data,
  }

}
@Roles(ROLE.ADMIN )
@UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let fileName;
      console.log(file)
      if (file) {
        fileName = file.originalname;
      } else {
        fileName = updateProductDto.productImage;
      }
      console.log(fileName)
    updateProductDto.productImage=fileName;
    const data = await this.productService.update(id, updateProductDto);
    console.log(data)
    return {
      message: 'Product updated successfully',
      data,
      };
    }
    catch (error) {
      throw error;
      }
  }
  @Roles(ROLE.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data= await this.productService.delete(id);
    return {
      message: 'Product deleted successfully',
      data
  }
}
}
