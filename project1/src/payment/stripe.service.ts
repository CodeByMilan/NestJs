
import { Injectable } from '@nestjs/common';
import { IOrderDetail } from 'src/order/dto/create-order.dto';
import { OrderQueueService } from 'src/queue/orderQueueService';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly orderQueueService: OrderQueueService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckoutSession(
    items: IOrderDetail[],
  ): Promise<any> {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      success_url: `${process.env.BASEURL}/order/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASEURL}/cancel`,
    });
    const sessionId = session.id;
    const sessionUrl=session.url
    await this.orderQueueService.addStripeComplete(sessionId);
    return {
      sessionUrl,
      sessionId,
  }
}
}