import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { ROLE } from 'src/database/entities/user.entity';
import { request } from 'http';
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.CUSTOMER)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('add')
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Req() request: AuthRequest,
  ) {
    const userId=request.user.id;
    createOrderDto.userId=userId;
    const data = await this.orderService.createOrder(createOrderDto);
    return {
      message: 'order created successfully',
      data: data,
    };
  }
  @Roles(ROLE.ADMIN)
  @Get()
  async fetchAllOrders() {
    const data = await this.orderService.fetchAllOrders();
    return {
      message: 'orders found successfully',
      data: data,
    };
  }

  @Get('myOrders')
  async fetchMyOrder(@Req()request:AuthRequest) {
    const userId=request.user.id
    try {
      const data = await this.orderService.fetchMyOrders(userId);
      return {
        message: 'Orders fetched successfully',
        data: data,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
  @Roles(ROLE.ADMIN)
  @Patch('updateOrder/:id')
  async updateOder(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateOrderDto: UpdateOrderDto,
  ) {
    const data = await this.orderService.updateOrder(id, updateOrderDto);
    return {
      message: 'order updated successfully',
      data: data,
    };
  }

  @Delete(':id')
  async deleteOrder(@Param('id', ParseIntPipe) id: number,
  @Req() request:AuthRequest
) {
    const userId=request.user.id;
    const order = await this.orderService.fetchOrder(id);
    if (order.userId !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this order');
      }
    const data = await this.orderService.deleteOrder(id);
    return {
      message: 'order deleted successfully',
      data: data,
    };
  }
}
