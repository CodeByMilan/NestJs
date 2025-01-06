import { IsDecimal, IsEnum, IsOptional, IsString } from "class-validator";
import { ORDERSTATUS } from "src/database/entities/order.entity";

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    @IsEnum(ORDERSTATUS,{
        message:'Invalid order status'
    },)
    orderStatus:ORDERSTATUS
    @IsString()
    shippingAddress:string
    @IsDecimal()
    amount:number
    paymentId:number
    userId:number
}
