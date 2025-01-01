import { IsEmail, IsEnum, IsNotEmpty, IsString} from "class-validator";

export class createUserDto{

    @IsString()
    @IsNotEmpty()
    name:string;


    @IsEmail()
    email:string;

    @IsEnum(['ADMIN','ENGINEER','INTERN'],{
        message:'Invalid role'
    })
    role:'ADMIN'|'ENGINEER'|'INTERN'
}