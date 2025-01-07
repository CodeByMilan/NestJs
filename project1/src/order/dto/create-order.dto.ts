import { IsDecimal, IsString } from "class-validator";
import { PAYMENTMETHOD, PAYMENTSTATUS } from "src/database/entities/payment.entity";

export interface OrderDetail{
    quantity:number,
    productId:number
}
export class CreateOrderDto {
    
    @IsString()
    shippingAddress:string

    @IsDecimal()
    amount:number

    paymentDetails:{
        paymentMethod:PAYMENTMETHOD,
        paymentStatus:PAYMENTSTATUS
    }

    items:OrderDetail[]
}
