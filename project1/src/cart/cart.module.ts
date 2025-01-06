import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/database/entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([Cart]),
    JwtModule
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
