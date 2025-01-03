import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { Order } from 'src/database/entities/order.entity';
import { Payment } from 'src/database/entities/payment.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderDetail,Order,Payment]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
