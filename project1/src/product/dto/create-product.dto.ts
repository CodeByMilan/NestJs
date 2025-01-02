import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName:string

    @IsDecimal()
    price:number

    @IsString()
    @Length(10, 500)
    description:string

    @IsOptional()
    @IsString()
    productImage?:string
}
