import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/database/entities/orderDetails.entity';
import { Repository } from 'typeorm';
import { CreateOrderDetailDto } from '../dto/create-orderDetails.dto';
import { updateOrderDetailsDto } from '../dto/update-order.dto';

@Injectable()
export class OrderDetailsService {
    constructor(
        @InjectRepository(OrderDetail)
        private readonly orderDetailRepository: Repository<OrderDetail>,
      ){}
    
      async create(createOrderDetailDto: CreateOrderDetailDto) :Promise<OrderDetail>{
      const order = await this.orderDetailRepository.create(createOrderDetailDto);
      const data = this.orderDetailRepository.save(order);
      return data;
      }
      
      async findAll(): Promise<OrderDetail[]> {
       const data = await this.orderDetailRepository.find();
       if(!data||data.length===0){
        throw new NotFoundException('orders not found ');
       }
       return data;
      }
    
     async  findOne(id: number):Promise<OrderDetail> {
      const data = await this.orderDetailRepository.findOne({where:{id}});
      if(!data){
        throw new NotFoundException('order not found ');
        }
        return data;
      }
    
      async update(id: number, updateOrderDetailDto: updateOrderDetailsDto): Promise<OrderDetail> {
        const order = await this.orderDetailRepository.findOne({where:{id}});
        if(!order){
          throw new NotFoundException('order not found ');
          }
          const data = await this.orderDetailRepository.save({...order,...updateOrderDetailDto});
          return data;
      }
      async delete(id: number): Promise<number> {
        const order = await this.orderDetailRepository.findOne({ where: { id } });
        if (!order) {
          throw new NotFoundException('Product not found');
        }
          await this.orderDetailRepository.delete(id);
        return order.id
        
      }
}
