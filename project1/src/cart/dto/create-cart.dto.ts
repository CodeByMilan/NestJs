import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateCartDto {
    @ApiProperty()
    @IsNotEmpty()
    quantity:number

    @ApiProperty()
    @IsNotEmpty()
    productId:number
}
