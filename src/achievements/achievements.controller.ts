import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	ParseIntPipe,
	Version,
} from "@nestjs/common";
import { AchievementsService } from "./achievements.service";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { UpdateAchievementDto } from "./dto/update-achievement.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("achievements")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("achievements")
export class AchievementsController {
	constructor(private readonly achievementsService: AchievementsService) {}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Criar nova conquista" })
	@ApiResponse({ status: 201, description: "Conquista criada com sucesso" })
	create(@Body() createAchievementDto: CreateAchievementDto) {
		return this.achievementsService.create(createAchievementDto);
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Listar todas as conquistas" })
	@ApiResponse({ status: 200, description: "Lista de conquistas" })
	findAll() {
		return this.achievementsService.findAll();
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Buscar conquista por ID" })
	@ApiResponse({ status: 200, description: "Conquista encontrada" })
	@ApiResponse({ status: 404, description: "Conquista não encontrada" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.achievementsService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Atualizar conquista" })
	@ApiResponse({ status: 200, description: "Conquista atualizada com sucesso" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateAchievementDto: UpdateAchievementDto,
	) {
		return this.achievementsService.update(id, updateAchievementDto);
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Remover conquista" })
	@ApiResponse({ status: 200, description: "Conquista removida com sucesso" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.achievementsService.remove(id);
	}

	@Get("user/:userId")
	@Version("1")
	@ApiOperation({ summary: "Buscar conquistas do usuário" })
	@ApiResponse({ status: 200, description: "Conquistas do usuário" })
	getUserAchievements(@Param("userId", ParseIntPipe) userId: number) {
		return this.achievementsService.getUserAchievements(userId);
	}

	@Post("check/:userId")
	@Version("1")
	@ApiOperation({ summary: "Verificar e conceder conquistas do usuário" })
	@ApiResponse({ status: 200, description: "Conquistas verificadas" })
	checkAndAwardAchievements(@Param("userId", ParseIntPipe) userId: number) {
		return this.achievementsService.checkAndAwardAchievements(userId);
	}

	@Post("clean-duplicates/:userId")
	@Version("1")
	@ApiOperation({ summary: "Limpar conquistas duplicadas do usuário" })
	@ApiResponse({ status: 200, description: "Duplicatas removidas" })
	cleanDuplicateAchievements(@Param("userId", ParseIntPipe) userId: number) {
		return this.achievementsService.cleanDuplicateAchievements(userId);
	}

	@Post("clean-all-duplicates")
	@Version("1")
	@ApiOperation({ summary: "Limpar todas as conquistas duplicadas do banco" })
	@ApiResponse({ status: 200, description: "Todas as duplicatas removidas" })
	cleanAllDuplicates() {
		return this.achievementsService.cleanAllDuplicates();
	}
}
