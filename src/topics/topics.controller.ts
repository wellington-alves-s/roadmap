import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Version,
} from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("topics")
export class TopicsController {
	constructor(private readonly topicsService: TopicsService) {}

	@Post()
	@Version("1")
	@UseGuards(JwtAuthGuard)
	create(@Body() createTopicDto: CreateTopicDto) {
		return this.topicsService.create(createTopicDto);
	}

	@Get()
	@Version("1")
	findAll() {
		return this.topicsService.findAll();
	}

	@Get(":id")
	@Version("1")
	findOne(@Param("id") id: string) {
		return this.topicsService.findOne(+id);
	}

	@Get("level/:levelId")
	@Version("1")
	findByLevel(@Param("levelId") levelId: string) {
		return this.topicsService.findByLevel(+levelId);
	}

	@Patch(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	update(@Param("id") id: string, @Body() updateTopicDto: UpdateTopicDto) {
		return this.topicsService.update(+id, updateTopicDto);
	}

	@Delete(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	remove(@Param("id") id: string) {
		return this.topicsService.remove(+id);
	}
}
