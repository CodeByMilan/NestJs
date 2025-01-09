import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PaymentService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly productService: ProductService,
  ) {}

  async generateAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > now) {
      return this.accessToken;
    }
    const url = `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`;
    const auth = {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    };

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(url, 'grant_type=client_credentials', {
            auth,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(
            map((res: AxiosResponse) => res.data),
            catchError((error) => {
              console.error(
                'Error generating access token:',
                error.response?.data || error.message,
              );
              throw new Error('Failed to generate PayPal access token');
            }),
          ),
      );
      this.accessToken = response.access_token;
      this.tokenExpiry = now + response.expires_in - 60; // Subtract buffer time
      return this.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error.message);
      throw new Error('Error generating PayPal access token');
    }
  }

  async createOrder(productId: number, amount: number,quantity:number): Promise<any> {
    const accessToken = await this.generateAccessToken();
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`;
    const productData = await this.productService.findOne(productId);

    if (!productData) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const data = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: { 
                currency_code: 'USD', 
                value: amount },
            },
          },
          items: [
            {
              name: productData.productName,
              quantity: quantity,
              unit_amount: { 
              currency_code: 'USD',
              value: amount },
            },
          ],
        },
      ],
      application_context: {
        return_url: `${process.env.BASEURL}/order/complete-order`,
        cancel_url: `${process.env.BASEURL}/order/cancel-order`,
        user_action: 'PAY_NOW',
        brand_name: 'Sajha Pasal',
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(
            map((res: AxiosResponse) => res.data),
            catchError((error) => {
              console.error(
                'Error creating PayPal order:',
                error.response?.data || error.message,
              );
              throw new Error('Failed to create PayPal order');
            }),
          ),
      );

      const approveLink = response.links.find(
        (link) => link.rel === 'approve',
      )?.href;
      if (!approveLink) {
        throw new Error('Approval link not found in the response');
      }

      return { approveLink, orderId: response.id }; // Return both approve link and order ID
    } catch (error) {
      console.error('Error in createOrder:', error.message);
      throw error;
    }
  }

  async captureOrder(orderId: string): Promise<any> {
    const accessToken = await this.generateAccessToken();
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(
            url,
            {},
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .pipe(
            map((res: AxiosResponse) => res.data),
            catchError((error) => {
              console.error(
                'Error capturing PayPal order:',
                error.response?.data || error.message,
              );
              throw new Error('Failed to capture PayPal order');
            }),
          ),
      );

      // console.log("inside capture", response);

      const { status, links, payer } = response;
      const result = {
        status, // Status of the order
        link: links.find((link) => link.rel === 'self')?.href, // Link to the order details
        payerId: payer.payer_id, // Payer ID from the response
      };

      return result;
    } catch (error) {
      console.error('Error in captureOrder:', error.message);
      throw error;
    }
  }
}
