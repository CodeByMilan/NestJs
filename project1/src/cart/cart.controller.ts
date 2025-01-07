import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { ROLE } from 'src/database/entities/user.entity';
@UseGuards(AuthGuard, RolesGuard)
@Roles(ROLE.CUSTOMER)
@Controller('customer/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post('add')
  async addToCart(
    @Body(ValidationPipe) createCartDto: CreateCartDto,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;

    if (!userId) {
      return { message: 'User not authenticated' };
    }
    const data = await this.cartService.addToCart(userId, createCartDto);
    return {
      message: 'product added to cart successfully',
      data:data,     
    };
  }
  @Get()
  async getCartItems(@Req() request: AuthRequest) {
    const userId = request.user.id;
    const data = await this.cartService.getCartItems(userId);
    return {
      message: 'cat items fetched successfully',
      data: data,
    };
  }

  @Patch(':productId')
  async updateCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @Body(ValidationPipe) updateCartDto: UpdateCartDto,
    @Req() request: AuthRequest,
  ) {
    const userId = request.user.id;
    if(!userId){
      return {message:'User not authenticated'}
    }
    const data = await this.cartService.updateCartItem(userId,productId, updateCartDto);
    return {
      message: 'cart updated successfully',
      data: data,
    };
  }

  @Delete(':productId')
  async remove(@Param('productId', ParseIntPipe) productId: number,
  @Req()request:AuthRequest
) {
  const userId=request.user.id
    const data = await this.cartService.deleteCartItem(userId,productId);
    return {
      message: 'cart item deleted  successfully',
      data: data,
    };
  }
}
