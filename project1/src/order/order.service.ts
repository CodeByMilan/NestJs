import { ConflictException, Delete, Injectable, NotFoundException, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, ORDERSTATUS } from 'src/database/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ){}

  async createOrder(createOrderDto: CreateOrderDto) :Promise<Order>{
  const order = await this.orderRepository.create(createOrderDto);
  const data = this.orderRepository.save(order);
  return data;
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
  async deleteOrder(id: number,
  ): Promise<number> {
    const order = await this.orderRepository.findOne({ where: { id } });
    const orderStatus = order.orderStatus
    if (!order) {
      throw new NotFoundException('order not found');
    }
    if(orderStatus === ORDERSTATUS.ONTHEWAY){
      throw new ConflictException('you cannot delete this order as it is ontheway');
      }
      await this.orderRepository.delete(id);
    return order.id
    
  }
}
