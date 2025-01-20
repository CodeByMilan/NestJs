import { Injectable } from '@nestjs/common';
import { WishListEntity } from '../entities/wishlist.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishListCreateDto } from '../../dtos/request/wishList.create.dto';

@Injectable()
export class WishListRepository  {
  constructor(
    @InjectRepository(WishListEntity)
    private readonly wishListRepository: Repository<WishListEntity>,
  ) {
  
  }
  async addToWishList(wishListDto: WishListCreateDto) {
    const wishList = this.wishListRepository.create(wishListDto);
    return this.wishListRepository.save(wishList);
  }

  async removeFromWishLit(id: number) {
    return this.wishListRepository.delete(id);
  }

  async getWishList() {
    return this.wishListRepository.find();
  }

  async getWishListById(id: number) {
    return this.wishListRepository.findOne({ where: { id } });
  }
  async findOne(options:Record<string,any>){
    return this.wishListRepository.findOne(options);
  }
}
