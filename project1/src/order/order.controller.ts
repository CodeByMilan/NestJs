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
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { ROLE } from 'src/database/entities/user.entity';
import { Public } from 'src/custom/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(ROLE.CUSTOMER)
  @Post('add')
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    const data = await this.orderService.createNewOrder(userId, createOrderDto);
    return {
      message: 'order created successfully',
      data,
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

  @Roles(ROLE.CUSTOMER)
  @Get('myOrders')
  async fetchMyOrder(@Req() request: AuthRequest) {
    const userId = request.user.id;
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

  @Roles(ROLE.CUSTOMER)
  @Get('byUserId/:id')
  async fetchOrderByUserId(@Param('id') id: number) {
    const data = await this.orderService.getOrdersByUserId(id);
    return {
      message: 'Order fetched successfully',
      data: data,
    };
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

  @Roles(ROLE.CUSTOMER)
  @Delete(':orderId')
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    const order = await this.orderService.fetchOrder(orderId);
    if (order.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this order',
      );
    }
    const data = await this.orderService.deleteOrder(userId, orderId);
    return {
      message: 'order deleted successfully',
      data: data,
    };
  }

  @Public()
  @Get('complete-order')
  async completeOrder(@Query('token') token: string) {
    try {
      console.log('hello');
      const paymentData = await this.orderService.completeOrder(token);
      return {
        message: 'payment completed successfully',
        paymentData,
      };
    } catch (error) {
      console.error('Error in completeOrder:', error.message);
      throw new InternalServerErrorException('Failed to complete the payment');
    }
  }

  @Public()
  @Get('cancel-order')
  async cancelOrder(@Query('token') token: string) {
    try {
      const order = await this.orderService.cancelOrder(token);
      return {
        message: 'Order canceled successfully',
        order,
      };
    } catch (error) {
      console.error('Error in cancelOrder:', error.message);
      throw new InternalServerErrorException('Failed to cancel the order');
    }
  }

  @Public()
  @Get('stripe/success')
  async stripeSuccess(@Query('session_id') sessionId: string) {
    console.log("hello")
    try {
      const paymentData = await this.orderService.completeStripeSuccess(sessionId);
      return {
        message: 'payment completed successfully',
        paymentData,
      };
    } catch (error) {
      console.error('Error in completeOrder:', error.message);
      throw new InternalServerErrorException('Failed to complete the payment');
    }
  }
}
