import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { Order } from 'src/database/entities/order.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { PaymentService } from 'src/payment/paymentService';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/database/entities/product.entity';
import { QueueModule } from 'src/queue/queueModule';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderDetail,Order,Payment,Product]),
    JwtModule,
    HttpModule,
    forwardRef(() => QueueModule),
  ],
  controllers: [OrderController],
  providers: [OrderService,PaymentService,ProductService],
  exports:[OrderService]
})
export class OrderModule {}
