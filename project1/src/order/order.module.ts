import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { Order } from 'src/database/entities/order.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { OrderDetailsService } from './orderDetails/order-details.service';
import { OrderDetailsController } from './orderDetails/order-details.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderDetail,Order,Payment]),
  ],
  controllers: [OrderController, PaymentController,OrderDetailsController],
  providers: [OrderService, PaymentService,OrderDetailsService],
})
export class OrderModule {}
