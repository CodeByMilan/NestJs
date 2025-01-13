import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { OrderQueueService } from './orderQueueService';
import { OrderModule } from 'src/order/order.module';
import { QUEUE_NAMES } from './queueTypes';


@Module({
  imports: [
  BullModule.forRoot({
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)||6379,
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
