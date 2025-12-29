import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateRoadmapDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsBoolean()
	isDefault?: boolean;
}

