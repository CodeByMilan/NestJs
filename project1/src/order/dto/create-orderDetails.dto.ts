import { IsDecimal, IsInt} from "class-validator";

export class CreateOrderDetailDto {
    @IsInt()
    quantity:number

    orderId:number
    productId:number
}
