import { IsBoolean, IsOptional } from "class-validator";

export class UpdateProgressDto {
	@IsOptional()
	@IsBoolean()
	completed?: boolean;
}
