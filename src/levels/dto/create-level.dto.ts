import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from "class-validator";

export class CreateLevelDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalXp?: number;
}
