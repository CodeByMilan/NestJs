import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderService } from 'src/order/order.service';
import { JOB_NAMES, QUEUE_NAMES } from './queueTypes';

@Processor(QUEUE_NAMES.ORDER)
export class OrderQueueProcessor {
  constructor(private readonly orderService: OrderService) {}
  @Process(JOB_NAMES.COMPLETE_ORDER)
  async completeOrder(job: Job<any>, token?: string): Promise<any> {
    console.log(job)
  const {paypalOrderId} = job.data;
    try {
      await this.orderService.completeOrder(paypalOrderId);
      console.log(`Order ${job.data.paypalOrderId} completed successfully`);
    } catch (error) {
      console.error(`Error completing order ${job.data.paypalOrderId}:`, error);
      throw error;
    }
  }

  @Process(JOB_NAMES.CANCELORDER)
  async cancelOrder(job: Job<any>, token?: string): Promise<any> {
    
    console.log(`Processing job ${job.id} of type ${job.name}`);
    try {
      await this.orderService.cancelOrder(job.data.orderId);
      console.log(`Order ${job.data.orderId} cancelled successfully`);
    } catch (error) {
      console.error(`Error cancelling order ${job.data.orderId}:`, error);
      throw error;
    }
  }
}
