import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("add")
 async  create(@Body(ValidationPipe) createOrderDto: CreateOrderDto) {
  const data = await this.orderService.create(createOrderDto);
  return {
    message:'order created successfully',
    data:data
  }
 }
  @Get()
  async findAll() {
   const data = await this.orderService.findAll();
   return {
    message:'orders found successfully',
    data:data
  }
  }
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
  const data = await this.orderService.findOne(id);
  return {
    message:'order found successfully',
    data:data
    }
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, 
  @Body(ValidationPipe) updateOrderDto: UpdateOrderDto) {
   const data = await this.orderService.update(id,updateOrderDto)
   return {
    message:'order updated successfully',
    data:data
    } 
  }

  @Delete(':id')
  async remove(@Param('id' ,ParseIntPipe) id: number) {
    const data =  await this.orderService.delete(id)
    return {
      message:'order deleted successfully',
      data:data
      }
  }
}
