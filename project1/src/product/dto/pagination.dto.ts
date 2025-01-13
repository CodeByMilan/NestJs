import { IsBoolean, IsNumber, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip:number


    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit:number

    @IsNumber()
    @IsPositive()
    @Min(1)
    @IsOptional()
    page: number ;

    @IsBoolean()
    @IsOptional()
    skipPagination:boolean
}