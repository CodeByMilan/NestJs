import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePracticeDto {
  @IsNotEmpty()@IsString()
  readonly name: string;
  @IsNotEmpty() @IsEmail()
  readonly email: string;
  @IsNotEmpty()@IsNumber()
  readonly age: number;
}
