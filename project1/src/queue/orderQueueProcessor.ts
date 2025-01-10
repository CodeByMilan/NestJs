import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { OrderService } from "src/order/order.service";

@Processor('order')
export class OrderQueueProcessor extends WorkerHost {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  async process(job: Job<any>, token?: string): Promise<any> {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    
    try {
      if (job.name === 'completeOrder') {
        console.log('hello compeleteorder')
        await this.handleCompleteOrderJob(job);
      } else {
        console.log(`No handler for job type: ${job.name}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }

    console.log(`Job ${job.id} completed`);
  }
  async onFailed(job: Job, err: Error): Promise<void> {
    console.error(`Job ${job.id} failed with error:`, err.message);
  }

  async handleCompleteOrderJob(job: Job<{ orderId: string }>) {
    try {
      await this.orderService.completeOrder(job.data.orderId);
      console.log(`Order ${job.data.orderId} completed successfully`);
    } catch (error) {
      console.error(`Error completing order ${job.data.orderId}:`, error);
      throw error; 
    }
  }
}
