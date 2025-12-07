import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	UseGuards,
	Version,
} from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@Controller("progress")
@UseGuards(JwtAuthGuard)
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Post()
	@Version("1")
	create(@Body() createProgressDto: CreateProgressDto) {
		return this.progressService.create(createProgressDto);
	}

	@Get()
	@Version("1")
	findAll() {
		return this.progressService.findAll();
	}

	@Get("user/:userId")
	@Version("1")
	findByUser(@Param("userId", ParseIntPipe) userId: number) {
		return this.progressService.findByUser(userId);
	}

	@Get("user/:userId/stats")
	@Version("1")
	getUserStats(@Param("userId", ParseIntPipe) userId: number) {
		return this.progressService.getUserStats(userId);
	}

	@Get(":id")
	@Version("1")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.progressService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	update(@Param("id", ParseIntPipe) id: number, @Body() updateProgressDto: UpdateProgressDto) {
		return this.progressService.update(id, updateProgressDto);
	}

	@Post("complete/:userId/:topicId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	async completeTopic(
		@Param("userId") userId: string,
		@Param("topicId") topicId: string,
		@CurrentUser() user: any,
	) {
		return this.progressService.completeTopic(+userId, +topicId);
	}

	@Delete("reset/:userId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	async resetProgress(@Param("userId") userId: string, @CurrentUser() user: any) {
		return this.progressService.resetProgress(+userId);
	}

	@Delete(":id")
	@Version("1")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.progressService.remove(id);
	}
}
