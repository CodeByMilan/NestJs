import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsString } from "class-validator";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "src/database/entities/payment.entity";

export interface IOrderDetail{
    quantity:number,
    productId:number,
    productName:string,
    price:number
}

export class CreateOrderDto {

    @ApiProperty()
    @IsString()
    shippingAddress:string

    @ApiProperty()
    @IsDecimal()
    amount:number
    @ApiProperty()
    paymentDetails:{
        paymentMethod:PAYMENT_METHOD,
        paymentStatus:PAYMENT_STATUS
    }
    @ApiProperty()
    items:IOrderDetail[]
}
