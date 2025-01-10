import { BadRequestException, ConflictException, Delete, Injectable, InternalServerErrorException, NotFoundException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, ORDERSTATUS } from 'src/database/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PAYMENTMETHOD, PAYMENTSTATUS } from 'src/database/entities/payment.entity';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { PaymentService } from 'src/payment/paymentService';
import { OrderQueueService } from 'src/queue/orderQueueService';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly paymentService: PaymentService,
  ) {}
  async createOrder(userId: number, createOrderDto: CreateOrderDto): Promise<any> {
    const { shippingAddress, amount, paymentDetails, items } = createOrderDto;

    if (items.length === 0) {
      throw new ConflictException('Order must have at least one item');
    }
    let payment;
    let approvalLink ;
    const productId=createOrderDto.items[0].productId
    const quantity =createOrderDto.items[0].quantity
    if (paymentDetails.paymentMethod === PAYMENTMETHOD.PAYPAL) {
      approvalLink = await this.paymentService.createOrder(productId,amount,quantity,items);
      payment = this.paymentRepository.create({
        paymentMethod: paymentDetails.paymentMethod,
      });
    } else {
      payment = this.paymentRepository.create({
        paymentMethod: paymentDetails.paymentMethod,
      });
    }
    // console.log("approveLink",approvalLink)
    const paymentData = await this.paymentRepository.save(payment);
    const order = this.orderRepository.create({
      userId,
      shippingAddress,
      amount,
      paymentId: paymentData.id,
      paypalOrderId: approvalLink?.orderId ,
      productData:items
    });
   const payLink =approvalLink?.approveLink;
  //  console.log(payLink)
    const data = await this.orderRepository.save(order);
    return {data,payLink};
  }

  async capturePayPalOrder(orderId: string): Promise<any> {
    const captureResult = await this.paymentService.captureOrder(orderId);
    return captureResult.data;
  }

  async fetchAllOrders(): Promise<Order[]> {
   const data = await this.orderRepository.find();
   if(!data||data.length===0){
    throw new NotFoundException('orders not found ');
   }
   return data;
  }

 async  fetchMyOrders(userId: number):Promise<Order[]> {
  const data = await this.orderRepository.find({where:{userId}});
  if(data.length ===0){
    throw new NotFoundException('order not found ');
    }
    return data;
  }

  async  fetchOrder(id: number):Promise<Order> {
    const data = await this.orderRepository.findOne({where:{id}});
    if(!data){
      throw new NotFoundException('order not found ');
      }
      return data;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({where:{id}});
    if(!order){
      throw new NotFoundException('order not found ');
      }
      const data = await this.orderRepository.save({...order,...updateOrderDto});
      return data;
  }

  async deleteOrder(orderId: number,userId:number
  ): Promise<number> {
    const order = await this.orderRepository.findOne({ where: 
      { 
        id:orderId, 
        userId
    } });
    const orderStatus = order.orderStatus
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if(orderStatus === ORDERSTATUS.ONTHEWAY){
      throw new ConflictException('you cannot delete this order as it is ontheway');
      }
    await this.orderRepository.delete(orderId);
    return order.id
    
  }

  async completeOrder(token: string) {
    const paypalOrderId=token
    console.log("token",token)
    if (!token) {
      throw new BadRequestException('PayPal order ID is required');
    }
    try {
      const captureResult = await this.paymentService.captureOrder(token);
      console.log("capture Result", captureResult);
      const order = await this.orderRepository.findOne({ where: { paypalOrderId} });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const paymentId = order.paymentId;
      const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      payment.paymentStatus = captureResult.status;
      await this.paymentRepository.save(payment);
      return {
        payment,order
      }
    } catch (error) {
      console.error('Error in completeOrder:', error.message);
      throw new InternalServerErrorException('Failed to complete the order');
    }
  }

  async cancelOrder(token: string) {
    if (!token) {
      throw new BadRequestException('PayPal order ID is required');
    }
    const order = await this.orderRepository.findOne({ where: { paypalOrderId: token } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const paymentId = order.paymentId;
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    payment.paymentStatus = PAYMENTSTATUS.FAILED
    await this.paymentRepository.save(payment);
    return {
      payment,
      order
    }
  } catch (error) {
    console.error('Error in completeOrder:', error.message);
    throw new InternalServerErrorException('Failed to complete the order');
  }
}

