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
import { OrderQueueProcessor } from 'src/queue/orderQueueProcessor';
import { CustomQueryService } from 'src/customQuery/queryBuilder';
import { User } from 'src/database/entities/user.entity';
import { StripeService } from 'src/payment/stripe.service';
import { EventGateWayModule } from 'src/socket/event.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([OrderDetail,Order,Payment,Product,User]),
    JwtModule,
    HttpModule,
    forwardRef(() => QueueModule),
    EventGateWayModule
  ],
  controllers: [OrderController],
  providers: [OrderService,PaymentService,ProductService,OrderQueueProcessor,CustomQueryService
    ,StripeService
  ],
  exports:[OrderService]
})
export class OrderModule {}
