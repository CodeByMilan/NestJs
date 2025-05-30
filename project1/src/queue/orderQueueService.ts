import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { JOB_NAMES, QUEUE_NAMES } from './queueTypes';

@Injectable()
export class OrderQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.ORDER)
    private readonly orderQueue: Queue) {}

  async addCompleteOrderJob(paypalOrderId: string) {
    await this.orderQueue.add(JOB_NAMES.COMPLETE_ORDER, { paypalOrderId }, {
      delay:3000000,
      attempts: 1, 
      backoff: 60000, 
    })
  }
  async addStripeComplete(sessionId:string){
    await this.orderQueue.add(JOB_NAMES.STRIPE_SUCCESS, { sessionId }, {
      delay:5*60*1000,
      attempts: 1,
      backoff: 60000,
      });
  }
}
