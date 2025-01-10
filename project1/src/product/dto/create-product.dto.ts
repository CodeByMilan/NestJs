import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";
import { CustomDecimalParser } from "src/custom/decimalParser";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productName:string

    @ApiProperty()
    @CustomDecimalParser()
    price:number
    @ApiProperty()
    description:string
    @ApiProperty()
    @IsOptional()
    @IsString()
    productImage?:string
    @ApiProperty()
    userId:number
}
