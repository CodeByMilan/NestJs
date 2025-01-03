import { IsDecimal, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    orderStatus:string
    @IsString()
    shippingAddress:string
    @IsDecimal()
    amount:number
    paymentId:number
    userId:number
}
