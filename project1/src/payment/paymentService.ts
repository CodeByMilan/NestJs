import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { response } from 'express';
import { access } from 'fs';
import{catchError, filter, firstValueFrom, map, Observable} from 'rxjs'
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PaymentService {

  constructor(private readonly httpService: HttpService,
    
    private readonly productRepository:ProductService,
  ) {}

  async generateAccessToken(): Promise<string> {
    const url = `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`;
    let accessToken;
    const auth = {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    };
    // const response: Observable<AxiosResponse>= await this.httpService
    //   .post(url, 'grant_type=client_credentials', {
    //     auth,
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    // //   })
    //   console.log(response)
      await firstValueFrom( this.httpService
      .post(url, 'grant_type=client_credentials', {
        auth,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).pipe(
        map((response: AxiosResponse) => {
          return response;
        }),
        map((response: AxiosResponse) => {

          accessToken= response.data.access_token;
        }),
        catchError((error) => {
          throw Error(error.message);
        }),
      )
    )
    return accessToken;
  }

  async createOrder(productId: number, amount: number): Promise<string> {
    let payLink: string;
    const accessToken = await this.generateAccessToken();
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`;
    const productData = await this.productRepository.findOne(productId);  
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
                value: amount,
              },
            },
          },
          items: [
            {
              name: productData.productName,
              quantity: 4,
              unit_amount: {
                currency_code: 'USD',
                value: (amount / 4),
              },
            },
          ],
        },
      ],
      application_context: {
        return_url: `${process.env.BASEURL}/complete-order`,
        cancel_url: `${process.env.BASEURL}/cancel-order`,
        user_action: 'PAY_NOW',
        brand_name: 'Sajha Pasal',
      },
    };  
    try {
      await firstValueFrom(
        this.httpService.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }).pipe(
          map((response: AxiosResponse) => {
            console.log('Response from PayPal API:', response.data);
            const approveLink = response.data.links.find(link => link.rel === 'approve');
            if (approveLink) {
              payLink = approveLink.href;
            } else {
              throw new Error('Approval link not found in the response');
            }
          }),
          catchError((error) => {
            console.error('Error response from PayPal API:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error while creating PayPal order');
          }),
        ),
      );
    } catch (error) {
      console.error('Error in createOrder:', error.message);
      throw error;
    }
    return payLink;
  }
  async captureOrder(orderId: number): Promise<any> {
    const accessToken = await this.generateAccessToken();
    const url = `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;

     await firstValueFrom(
      this.httpService.post(
        url,
        {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
      }
    }).pipe(
      map((response: AxiosResponse) => {
        console.log('Response from PayPal API:', response.data);
        }),
        catchError((error) => {
          console.error('Error response from PayPal API:', error.response?.data || error.message);
          throw new Error(error.response?.data?.message || 'Error while capturing PayPal order');
          }),  
    )

  )
  }
}
