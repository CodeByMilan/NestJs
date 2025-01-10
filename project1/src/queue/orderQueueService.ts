import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class OrderQueueService {
  constructor(@InjectQueue('order') private readonly orderQueue: Queue) {}

  async addCompleteOrderJob(orderId: string) {
    await this.orderQueue.add('completeOrder', { orderId }, {
      attempts: 5, 
      backoff: 60000, 
    });
  }
}
