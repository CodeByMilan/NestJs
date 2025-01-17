import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomQueryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findUserWithOrders(): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.orders', 'order') 
      .where('order.userId IS NOT NULL');
  
    return await query.getMany();
  }

  async findOrdersByUserId(userId:number):Promise<Order[]>{

    const query =this.orderRepository.createQueryBuilder('order')
    .innerJoinAndSelect('order.user', 'user')
    .where('order.userId = :userId', { userId });
    return await query.getMany();
  }
  
}
