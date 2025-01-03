import { IsDecimal, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    paymentStatus:string
    @IsString()
    paymentMethod:string
}
