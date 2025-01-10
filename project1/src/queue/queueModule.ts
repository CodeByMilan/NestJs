import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { OrderQueueService } from './orderQueueService';
import { OrderQueueProcessor } from './orderQueueProcessor';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    
    BullModule.registerQueue({
      name: 'order', 
    }),
    forwardRef(() => OrderModule),
  ],
  providers: [OrderQueueService, OrderQueueProcessor],
  exports: [OrderQueueService,BullModule],
})
export class QueueModule {}
