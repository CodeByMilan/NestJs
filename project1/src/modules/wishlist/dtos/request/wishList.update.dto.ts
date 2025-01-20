import { PartialType } from '@nestjs/swagger';
import { WishListCreateDto } from './wishList.create.dto';

export class WishListUpdateDto extends PartialType(WishListCreateDto) {}
