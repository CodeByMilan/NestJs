import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class createUserDto{

    @IsString()
    @IsNotEmpty()
    userName:string;


    @IsEmail()
    email:string;

    @IsString()
    password:string

    @IsEnum(['ADMIN','CUSTOMER'],{
        message:'Invalid role'
    })
    role:'ADMIN'|'CUSTOMER'

    @IsOptional() 
    @IsString()
    profileImage?: string;
}