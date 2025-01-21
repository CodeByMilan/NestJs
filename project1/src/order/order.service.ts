import {
  BadRequestException,
  ConflictException,
  Delete,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, ORDERSTATUS } from 'src/database/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Payment,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from 'src/database/entities/payment.entity';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { PaymentService } from 'src/payment/paymentService';
import { CustomQueryService } from 'src/customQuery/queryBuilder';
import { StripeService } from 'src/payment/stripe.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentService: PaymentService,
    private readonly customQuery: CustomQueryService,
    private readonly stripeService: StripeService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.customQuery.findOrdersByUserId(userId);
  }

  async createNewOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<any> {
    const { shippingAddress, amount, paymentDetails, items } = createOrderDto;

    if (items.length === 0) {
      throw new ConflictException('Order must have at least one item');
    }
    let stripeLink;
    let payment;
    let approvalLink;
    const productId = createOrderDto.items[0].productId;
    try {
      if (paymentDetails.paymentMethod === PAYMENT_METHOD.PAYPAL) {
        approvalLink = await this.paymentService.createOrder(
          productId,
          amount,
          items,
        );
      } else if (paymentDetails.paymentMethod === PAYMENT_METHOD.STRIPE) {
        stripeLink = await this.stripeService.createCheckoutSession(
          items,
        );
      } 
        payment = this.paymentRepository.create({
          paymentMethod: paymentDetails.paymentMethod,
        });
      // console.log("approveLink",approvalLink)
      const paymentData = await this.paymentRepository.save(payment);
      const order = this.orderRepository.create({
        userId,
        shippingAddress,
        amount,
        paymentId: paymentData.id,
        paypalOrderId: approvalLink?.orderId,
        productData: items,
      });
      const payLink = approvalLink?.approveLink || stripeLink?.sessionUrl|| null;
      //  console.log(payLink)
      const data = await this.orderRepository.save(order);
      if(stripeLink){
        const sessionId=stripeLink.sessionId
        await this.cacheManager.set('cachedStripePayment', { data,sessionId});
      }
      return { data, payLink };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async fetchAllOrders(): Promise<Order[]> {
    const data = await this.orderRepository.find();
    if (!data || data.length === 0) {
      throw new NotFoundException('orders not found ');
    }
    return data;
  }

  async fetchMyOrders(userId: number): Promise<Order[]> {
    const data = await this.orderRepository.find({ where: { userId } });
    if (data.length === 0) {
      throw new NotFoundException('order not found ');
    }
    return data;
  }

  async fetchOrder(id: number): Promise<Order> {
    const data = await this.orderRepository.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException('order not found ');
    }
    return data;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('order not found ');
    }
    const data = await this.orderRepository.save({
      ...order,
      ...updateOrderDto,
    });
    return data;
  }

  async deleteOrder(orderId: number, userId: number): Promise<number> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        userId,
      },
    });
    const orderStatus = order.orderStatus;
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if (orderStatus === ORDERSTATUS.ONTHEWAY) {
      throw new ConflictException(
        'you cannot delete this order as it is ontheway',
      );
    }
    await this.orderRepository.delete(orderId);
    return order.id;
  }

  async completeOrder(token: string) {
    const paypalOrderId = token;
    console.log('token', token);
    if (!token) {
      throw new BadRequestException('PayPal order ID is required');
    }
    try {
      const captureResult = await this.paymentService.captureOrder(token);

      // console.log("capture Result", captureResult);
      const order = await this.orderRepository.findOne({
        where: { paypalOrderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const paymentId = order.paymentId;
      const payment:Payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      switch (captureResult.status.toUpperCase()) {
        case 'COMPLETED':
          payment.paymentStatus = PAYMENT_STATUS.SUCCESS;
          break;
        case 'PENDING':
          payment.paymentStatus = PAYMENT_STATUS.PENDING;
          break;
        case 'FAILED':
          payment.paymentStatus = PAYMENT_STATUS.FAILED;
          break;
        default:
          throw new BadRequestException(`Unsupported PayPal status: ${captureResult.status}`);
      }
      await this.paymentRepository.save(payment);
      return {
        payment,
        order,
      };
    } catch (error) {
      console.error('Error in completeOrder:', error.message);
      throw new InternalServerErrorException('Failed to complete the order');
    }
  }

  async cancelOrder(token: string) {
    if (!token) {
      throw new BadRequestException('PayPal order ID is required');
    }
    const order = await this.orderRepository.findOne({
      where: { paypalOrderId: token },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const paymentId = order.paymentId;
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    payment.paymentStatus = PAYMENT_STATUS.FAILED;
    await this.paymentRepository.save(payment);
    return {
      payment,
      order,
    };
  }
  catch(error) {
    console.error('Error in completeOrder:', error.message);
    throw new InternalServerErrorException('Failed to complete the order');
  }

  async completeStripeSuccess(id: string) {
    const cachedData: any = await this.cacheManager.get('cachedStripePayment');
    if (!cachedData) {
      throw new InternalServerErrorException('Cached data not found');
    }
    const { data, sessionId } = cachedData;
    const paymentId = data.paymentId;
    let payment;
    if (sessionId == id) {
      payment = await this.paymentRepository.findOne({
        where: { id: paymentId },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
    }
    payment.paymentStatus = PAYMENT_STATUS.SUCCESS;
    await this.paymentRepository.save(payment);

    await this.cacheManager.del('cachedStripePayment');
    return {
      payment,
    };
  }
}
