import { Injectable } from '@nestjs/common';
import { WishListRepository } from '../repository/repositories/wishlist.repository';
import { WishListCreateDto } from '../dtos/request/wishList.create.dto';


@Injectable()
export class WishListService {
  constructor(
    private readonly wishListRepository: WishListRepository) {}

  async addToWishList(wishListDto: WishListCreateDto) {
    const wish = await this.wishListRepository.findOne({
      where: {
        userId: wishListDto.userId,
        productId: wishListDto.productId,
      },
    });
    if (wish) {
      return {
         message: 'Product is already in your wish list'
         };
    } 
      const wishList = await this.wishListRepository.addToWishList(wishListDto);
      return wishList;
  }


  async removeFromWishList(id:number) {
    const wishList = await this.wishListRepository.removeFromWishLit(id);
    if (!wishList) {
      return {
        message: 'Product is not in your wish list'
        };
        }
        console.log(wishList)
        return wishList;
}
}
