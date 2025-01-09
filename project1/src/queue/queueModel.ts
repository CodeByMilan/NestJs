import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AudioQueueProcessor } from '../order/queueProcessor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'audio', 
    }),
    
  ],
 
  exports: [BullModule],
})
export class QueueModule {}
