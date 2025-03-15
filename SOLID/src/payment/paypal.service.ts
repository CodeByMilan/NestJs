import { Injectable } from '@nestjs/common';
import { PaymentProcessor } from './payment.interface';

@Injectable()
export class PayPalService implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing $${amount} donation via PayPal...`);
    return true;
  }
}
