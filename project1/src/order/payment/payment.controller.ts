import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-order.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("add")
   async  create(@Body(ValidationPipe) createPaymentDto: CreatePaymentDto) {
    const data = await this.paymentService.create(createPaymentDto);
    return {
      message:'payment created successfully',
      data:data
    }
   }
    @Get()
    async findAll() {
     const data = await this.paymentService.findAll();
     return {
      message:'payment found successfully',
      data:data
    }
    }
    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id: number) {
    const data = await this.paymentService.findOne(id);
    return {
      message:'payment found successfully',
      data:data
      }
    }
  
    @Patch(':id')
    async update(@Param('id',ParseIntPipe) id: number, 
    @Body(ValidationPipe) UpdatePaymentDto: UpdatePaymentDto) {
     const data = await this.paymentService.update(id,UpdatePaymentDto)
     return {
      message:'payment updated successfully',
      data:data
      } 
    }
  
    @Delete(':id')
    async remove(@Param('id' ,ParseIntPipe) id: number) {
      const data =  await this.paymentService.delete(id)
      return {
        message:'payment deleted successfully',
        data:data
        }
    }
}
