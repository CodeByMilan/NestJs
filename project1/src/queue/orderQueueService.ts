import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class OrderQueueService {
  constructor(@InjectQueue('order') private readonly orderQueue: Queue) {}

  async addCompleteOrderJob(paypalOrderId: string) {
    console.log("inside aadd complete order job ",paypalOrderId)
    await this.orderQueue.add('completeOrder', { paypalOrderId }, {
      attempts: 5, 
      backoff: 60000, 
    });
  }
}
