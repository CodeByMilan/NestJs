import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, ValidationPipe } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from '../dto/create-orderDetails.dto';
import { updateOrderDetailsDto } from '../dto/update-order.dto';

@Controller('order-details')
export class OrderDetailsController {
    constructor(private readonly orderDetailsService: OrderDetailsService) {}
    @Post("add")
   async  create(@Body(ValidationPipe) createOrderDetailDto: CreateOrderDetailDto) {
    const data = await this.orderDetailsService.create(createOrderDetailDto);
    return {
      message:'orderDetail created successfully',
      data:data
    }
   }
    @Get()
    async findAll() {
     const data = await this.orderDetailsService.findAll();
     return {
      message:'ordersDetail found successfully',
      data:data
    }
    }
    @Get(':id')
    async findOne(@Param('id',ParseIntPipe) id: number) {
    const data = await this.orderDetailsService.findOne(id);
    return {
      message:'order found successfully',
      data:data
      }
    }
  
    @Patch(':id')
    async update(@Param('id',ParseIntPipe) id: number, 
    @Body(ValidationPipe) updateOrderDetailDto: updateOrderDetailsDto) {
     const data = await this.orderDetailsService.update(id,updateOrderDetailDto)
     return {
      message:'order updated successfully',
      data:data
      } 
    }
  
    @Delete(':id')
    async remove(@Param('id' ,ParseIntPipe) id: number) {
      const data =  await this.orderDetailsService.delete(id)
      return {
        message:'order deleted successfully',
        data:data
        }
    }
}
