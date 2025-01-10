import { Process, Processor } from "@nestjs/bull";
import { Job } from "bullmq";
import { OrderService } from "src/order/order.service";

@Processor('order')
export class OrderQueueProcessor {
  constructor(private readonly orderService: OrderService) {
  }
@Process('completeOrder')
  async process(job: Job<any>, token?: string): Promise<any> {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    try {
      await this.orderService.completeOrder(job.data.orderId);
      console.log(`Order ${job.data.orderId} completed successfully`);
    } catch (error) {
      console.error(`Error completing order ${job.data.orderId}:`, error);
      throw error; 
    }
  }
}
