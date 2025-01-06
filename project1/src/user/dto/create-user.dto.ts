import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import { ROLE } from "src/database/entities/user.entity";

export class createUserDto{
    @IsString()
    @IsNotEmpty()
    userName:string;


    @IsEmail()
    email:string;

    @IsString()
    password:string
    @IsOptional()
    @IsEnum(ROLE,{
        message:'Invalid role'
    },)
    role?:ROLE
}