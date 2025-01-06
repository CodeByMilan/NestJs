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
  async create(createCartDto: CreateCartDto):Promise<Cart>{
   const cart =await this.cartRepository.create(createCartDto);
   const data = await this.cartRepository.save(cart);
   return data;
  }

  async findAll(): Promise<Cart[]> {
    const data = await this.cartRepository.find();
    if(!data||data.length===0){
     throw new NotFoundException('cart not found ');
    }
    return data;
   }

   async  findOne(id: number):Promise<Cart> {
    const data = await this.cartRepository.findOne({where:{id}});
    if(!data){
      throw new NotFoundException('cart not found ');
      }
      return data;
    }

    async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
      const cart = await this.cartRepository.findOne({where:{id}});
      if(!cart){
        throw new NotFoundException('cart not found ');
        }
        const data = await this.cartRepository.save({...cart,...updateCartDto});
        return data;
    }
    async delete(id: number): Promise<number> {
      const cart = await this.cartRepository.findOne({ where: { id } });
      if (!cart) {
        throw new NotFoundException('cart not found');
      }
        await this.cartRepository.delete(id);
      return cart.id
      
    }
  }
