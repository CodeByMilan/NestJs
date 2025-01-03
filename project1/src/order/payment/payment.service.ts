import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/database/entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-order.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
      ){}
    
      async create(payment: CreatePaymentDto):Promise<Payment>{
      const paymentData = await this.paymentRepository.create(payment);
      const data = this.paymentRepository.save(paymentData);
      return data;
      }
      
      async findAll(): Promise<Payment[]> {
       const data = await this.paymentRepository.find();
       if(!data||data.length===0){
        throw new NotFoundException('payment not found ');
       }
       return data;
      }
    
     async  findOne(id: number):Promise<Payment> {
      const data = await this.paymentRepository.findOne({where:{id}});
      if(!data){
        throw new NotFoundException('payment not found ');
        }
        return data;
      }
    
      async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({where:{id}});
        if(!payment){
          throw new NotFoundException('payment not found ');
          }
          const data = await this.paymentRepository.save({...payment,...updatePaymentDto});
          return data;
      }
      async delete(id: number): Promise<number> {
        const payment= await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
          throw new NotFoundException('Payment not found');
        }
          await this.paymentRepository.delete(id);
        return payment.id
        
      }
}
