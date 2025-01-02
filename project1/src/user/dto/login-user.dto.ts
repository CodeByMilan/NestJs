import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class logInDto{
     @IsNotEmpty()
    email:string;
   
    @IsNotEmpty()
    password:string;

}