import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Address } from "nodemailer/lib/mailer"

export class SendMailDto{
    @IsOptional()
    from?:Address

    @IsNotEmpty()
    to:Address[]

    @IsString()
    subject:string
    //html is required as we dont want hard coded values in the mail this helps to keep dynamic data in the mail
    @IsString()
    @IsOptional()
    html?:string


    @IsString()
    @IsOptional()
    text?:string

    @IsOptional()
    placeholderReplacement?:Record<string,string>
}