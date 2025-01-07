import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from 'src/database/entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    
  ){}
  async addToCart(userId:number,createCartDto:CreateCartDto) {
    const { quantity, productId } = createCartDto;
    let cartItem = await this.cartRepository.findOne({
      where: { userId,productId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartRepository.create({
        userId,
        productId,
        quantity,
      });
      const cartData = await this.cartRepository.save(cartItem);
      console.log("cart:",cartData)
      return cartData
    }
  }
  async getCartItems(userId: number): Promise<Cart[]> {
    const cartData = await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });

    if (cartData.length === 0) {
      throw new NotFoundException('Cart is empty');
    }
    return cartData;
}

    async updateCartItem(userId:number,productId: number, updateCartDto: UpdateCartDto): Promise<Cart> {
      const cart = await this.cartRepository.findOne({where:{
        productId,
        userId
      }});
      if(!cart){
        throw new NotFoundException('no productId found for the user');
        }

        const data = await this.cartRepository.save({...cart,...updateCartDto});
        return data;
    }

    async deleteCartItem(userId:number,productId: number): Promise<number> {
      const cart = await this.cartRepository.findOne({ where: {
        productId ,
        userId
      } });
      if (!cart) {
        throw new NotFoundException('no product in the cart for the user ');
      }
      await this.cartRepository.delete(productId);
      return cart.productId
    }
  }
