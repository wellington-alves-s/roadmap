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
	ParseIntPipe,
} from "@nestjs/common";
import { RoadmapsService } from "./roadmaps.service";
import { CreateRoadmapDto } from "./dto/create-roadmap.dto";
import { UpdateRoadmapDto } from "./dto/update-roadmap.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("roadmaps")
export class RoadmapsController {
	constructor(private readonly roadmapsService: RoadmapsService) {}

	@Post()
	@Version("1")
	@UseGuards(JwtAuthGuard)
	create(@Body() createRoadmapDto: CreateRoadmapDto) {
		return this.roadmapsService.create(createRoadmapDto);
	}

	@Get()
	@Version("1")
	findAll() {
		return this.roadmapsService.findAll();
	}

	@Get("default")
	@Version("1")
	findDefault() {
		return this.roadmapsService.findDefault();
	}

	@Get(":id")
	@Version("1")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.roadmapsService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	update(@Param("id", ParseIntPipe) id: number, @Body() updateRoadmapDto: UpdateRoadmapDto) {
		return this.roadmapsService.update(id, updateRoadmapDto);
	}

	@Delete(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.roadmapsService.remove(id);
	}
}
