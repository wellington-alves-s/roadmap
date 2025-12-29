import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateFileDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsNotEmpty()
    @IsString()
    topicId: string;
}
