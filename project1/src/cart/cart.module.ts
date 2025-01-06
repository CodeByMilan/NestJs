import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/database/entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([Cart]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
