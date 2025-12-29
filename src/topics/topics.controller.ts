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
	Put,
	UseInterceptors,
	UploadedFiles,
	BadRequestException,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
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

	@Put(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FilesInterceptor("files", 10, {
			storage: diskStorage({
				destination: (req, file, cb) => {
					const uploadPath = join(process.cwd(), "uploads", "topics");
					if (!existsSync(uploadPath)) {
						mkdirSync(uploadPath, { recursive: true });
					}
					cb(null, uploadPath);
				},
				filename: (req, file, cb) => {
					const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
					// Preserva a extensão do arquivo original
					const ext = extname(file.originalname);
					cb(null, file.fieldname + "-" + uniqueSuffix + ext);
				},
			}),
			fileFilter: (req, file, cb) => {
				if (file.mimetype === "application/pdf") {
					cb(null, true);
				} else {
					cb(new BadRequestException("Only PDF files are allowed"), false);
				}
			},
			limits: {
				fileSize: 10 * 1024 * 1024, // 10MB
			},
		}),
	)
	updateWithFiles(
		@Param("id") id: string,
		@Body() updateData: any,
		@UploadedFiles() files: Express.Multer.File[],
	) {
		return this.topicsService.updateWithFiles(+id, updateData, files);
	}

	@Delete(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	remove(@Param("id") id: string) {
		return this.topicsService.remove(+id);
	}
}
