import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";
import { CustomDecimalParser } from "src/custom/decimalParser";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName:string

    @CustomDecimalParser()
    price:number

    description:string

    @IsOptional()
    @IsString()
    productImage?:string

    userId:number
}
