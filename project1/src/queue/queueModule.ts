import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { OrderQueueService } from './orderQueueService';
import { OrderModule } from 'src/order/order.module';
import { QUEUE_NAMES } from './queueTypes';
import {  ConfigService } from '@nestjs/config';
import { RedisConfig } from 'src/config/redis.config';


@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: RedisConfig(configService),
      }),
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
