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
import { PaymentService } from 'src/payment/paymentService';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}
  @Get()
  async addAudioJob(@Query('name') name: string) {
   const data= await this.orderService.addAudio(name);
  }
  @UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.CUSTOMER)
  @Post('add')
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Req() request: AuthRequest,
  ) {
    console.log("request",request)
    console.log("user",request.user)
    const userId = request.user.id;
    console.log("userID",userId)
    const data = await this.orderService.createOrder(userId, createOrderDto);
    return {
      message: 'order created successfully',
      data
    };
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @Get()
  async fetchAllOrders() {
    const data = await this.orderService.fetchAllOrders();
    return {
      message: 'orders found successfully',
      data: data,
    };
  }
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.CUSTOMER)
  @Delete(':id')
  async deleteOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    const order = await this.orderService.fetchOrder(id);
    if (order.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this order',
      );
    }
    const data = await this.orderService.deleteOrder(id);
    return {
      message: 'order deleted successfully',
      data: data,
    };
  }
  @Public()
  @Get('complete-order')
  async completeOrder(
    @Query('token') token: string,  
  ) {
    try {
      const order = await this.orderService.completeOrder(token);

      return {
        message: 'Order completed successfully',
        order,
      };
    } catch (error) {
      console.error('Error in completeOrder:', error.message);
      throw new InternalServerErrorException('Failed to complete the order');
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
}
