import { IsNotEmpty } from "class-validator"

export class CreateCartDto {
    @IsNotEmpty()
    quantity:number
    @IsNotEmpty()
    productId:number
}
