import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

import { IsOptional, IsUrl } from "class-validator";

export class CreateTopicDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsInt()
	@Min(1)
	xp: number;

	@IsInt()
	@Min(1)
	levelId: number;

	@IsOptional()
	@IsUrl()
	videoUrl?: string;

	@IsOptional()
	@IsString()
	description?: string;
}
