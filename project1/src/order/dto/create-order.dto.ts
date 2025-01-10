import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsString } from "class-validator";
import { PAYMENTMETHOD, PAYMENTSTATUS } from "src/database/entities/payment.entity";

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
        paymentMethod:PAYMENTMETHOD,
        paymentStatus:PAYMENTSTATUS
    }
    @ApiProperty()
    items:IOrderDetail[]
}
