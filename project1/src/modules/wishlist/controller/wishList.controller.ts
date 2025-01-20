import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { WishListService } from "../services/wishList.service";
import { WishListCreateDto } from "../dtos/request/wishList.create.dto";

@Controller('wishList')
export class WishListController{
  constructor(private readonly wishListService:WishListService) {}

   @Post('add')
   public async addToWishList( @Body() wishListCreateDto: WishListCreateDto) {

    try {
      const wish = await this.wishListService.addToWishList(wishListCreateDto);
      return {
        message: 'wishlist has been added successfully',
        data: wish,
      };
    } catch (error) {
        console.log(error)
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Error adding  wish list',
            data: null,
            };
    }
  }

}