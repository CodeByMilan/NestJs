import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import { ROLE } from "src/database/entities/user.entity";

export class createUserDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName:string;

    @ApiProperty()
    @IsEmail()
    email:string;

    @ApiProperty()
    @IsString()
    password:string

    @ApiProperty({ enum:ROLE})
    @IsOptional()
    @IsEnum(ROLE,{
        message:'Invalid role'
    },)
    role?:ROLE
}