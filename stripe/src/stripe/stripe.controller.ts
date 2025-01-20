// src/stripe/stripe.controller.ts

import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';
import { retry } from 'rxjs';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession() {
    const sessionUrl = await this.stripeService.createCheckoutSession();
    return {
      data: sessionUrl,
    }
  }

  @Get('success-stripe')
  async handleSuccess(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      return { message: 'Session ID is missing.' };
    }

    const session = await this.stripeService.retrieveSession(sessionId);
    if (session.payment_status === 'paid') {
      return { message: 'Payment successful!', session };
    } else {
      return { message: 'Payment not completed.', session };
    }
  }

  @Get('cancel-stripe')
  async cancelStripe(@Res() res: Response) {
    return {
      message: 'Payment was cancelled',
    };
  }
}
