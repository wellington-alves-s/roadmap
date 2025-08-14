import { IsOptional, IsString, IsInt, Min } from "class-validator";

export class UpdateTopicDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	xp?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	levelId?: number;
}
