import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class UpdateLevelDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalXp?: number;
}
