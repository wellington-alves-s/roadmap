import { IsNotEmpty, IsString, IsUrl, IsOptional } from "class-validator";

export class CreateResourceDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    topicId: string;
}
