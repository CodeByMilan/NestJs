import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { OrderQueueService } from './orderQueueService';
import { OrderQueueProcessor } from './orderQueueProcessor';
import { OrderModule } from 'src/order/order.module';
import { QUEUE_NAMES } from './queueTypes';

@Module({
  imports: [
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    
    },
  }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.ORDER, 
      defaultJobOptions: {
        removeOnComplete: true, 
        removeOnFail: { age: 3600 },
      },
    }),
    forwardRef(() => OrderModule),
  ],
  providers: [OrderQueueService],
  exports: [OrderQueueService,BullModule],
})
export class QueueModule {}
