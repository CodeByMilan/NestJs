import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class WishListCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: number;

   
    @ApiProperty()
    @IsNotEmpty()
    productId: number;
}