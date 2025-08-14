import { IsInt, Min } from "class-validator";

export class CreateProgressDto {
	@IsInt()
	@Min(1)
	userId: number;

	@IsInt()
	@Min(1)
	topicId: number;
}
