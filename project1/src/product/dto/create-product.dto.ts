import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName:string

    @IsDecimal()
    price:number

    description:string

    @IsOptional()
    @IsString()
    productImage?:string

    userId:number
}
