import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard, AuthRequest } from 'src/auth/authGuard';
import { RolesGuard } from 'src/auth/rolesGuard';
import { Roles } from 'src/custom/roles.decorator';
import { ROLE } from 'src/database/entities/user.entity';
@UseGuards(AuthGuard,RolesGuard)
@Roles(ROLE.CUSTOMER)
@Controller('customer/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post("add")
 async  addToCart(@Body(ValidationPipe) createCartDto: CreateCartDto,
 @Req() request:AuthRequest
) {
  const data = await this.cartService.addToCart(createCartDto);
  return {
    message:'product added to cart successfully',
    data:data
  }
 }
  @Get()
  async getCartItem() {
   const data = await this.cartService.getCartItem();
   return {
    message:'cat items fetched successfully',
    data:data
  }
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, 
  @Body(ValidationPipe) updateCartDto: UpdateCartDto) {
   const data = await this.cartService.updateCart(id,updateCartDto)
   return {
    message:'cart updated successfully',
    data:data
    } 
  }

  @Delete(':id')
  async remove(@Param('id' ,ParseIntPipe) id: number) {
    const data =  await this.cartService.delete(id)
    return {
      message:'cart item deleted  successfully',
      data:data
      }
  }
}
