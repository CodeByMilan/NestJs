import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Post("add")
 async  create(@Body(ValidationPipe) createCartDto: CreateCartDto) {
  const data = await this.cartService.create(createCartDto);
  return {
    message:'product added to cart successfully',
    data:data
  }
 }
  @Get()
  async findAll() {
   const data = await this.cartService.findAll();
   return {
    message:'cat items fetched successfully',
    data:data
  }
  }
  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
  const data = await this.cartService.findOne(id);
  return {
    message:'cart item fetched successfully',
    data:data
    }
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, 
  @Body(ValidationPipe) updateCartDto: UpdateCartDto) {
   const data = await this.cartService.update(id,updateCartDto)
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
