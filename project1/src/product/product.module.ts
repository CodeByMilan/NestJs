import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/database/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports:[
  TypeOrmModule.forFeature([Product]),
  JwtModule
],

  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
