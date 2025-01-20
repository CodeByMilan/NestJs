import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
  private stripe;

  constructor() {
    this.stripe = new Stripe('sk_test_51QjEmsHaOkKtDjTkpKjjrJdQrY6fU33zmE2QcCFutQ9gsTfXRAteXAsNP9vFWZeeug7P47WEDf37jRxls69LaeVo00rWyU9ljW', {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckoutSession(): Promise<any> {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd', 
            product_data: {
              name: 'T-shirt', 
            },
            unit_amount: 2000, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:4000/stripe/success-stripe`,
      cancel_url: `http://localhost:4000/stripe/cancel-stripe`,
    });
    console.log(session)
    return {
        sessionId: session.id,
       sessionUrl: session.url
    }
  }

  async retrieveSession(sessionId: string) {
    const data = await this.stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus=data.payment_status
    return paymentStatus;
  }
}