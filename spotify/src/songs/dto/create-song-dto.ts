import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsString } from "class-validator";


export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title;

    @IsNotEmpty()
    @IsArray()
    @IsString()
    readonly artist;
    @IsNotEmpty()
    @IsDateString()
    readonly releasedDate:Date;

    @IsMilitaryTime()
    @IsNotEmpty()
    readonly duration: Date;

}