import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	ParseIntPipe,
	UseGuards,
	Version,
	Delete,
	Query,
} from "@nestjs/common";
import { BadgesService } from "./badges.service";
import { CreateBadgeDto } from "./dto/create-badge.dto";
import { UpdateBadgeDto } from "./dto/update-badge.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("badges")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("badges")
export class BadgesController {
	constructor(private readonly badgesService: BadgesService) {}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Criar novo badge" })
	@ApiResponse({ status: 201, description: "Badge criado com sucesso" })
	create(@Body() createBadgeDto: CreateBadgeDto) {
		return this.badgesService.create(createBadgeDto);
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Listar todos os badges" })
	@ApiResponse({ status: 200, description: "Lista de badges" })
	findAll(@Query("roadmapId") roadmapId?: string) {
		const roadmapIdNum = roadmapId ? parseInt(roadmapId, 10) : undefined;
		return this.badgesService.findAll(roadmapIdNum);
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Buscar badge por ID" })
	@ApiResponse({ status: 200, description: "Badge encontrado" })
	@ApiResponse({ status: 404, description: "Badge não encontrado" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.badgesService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Atualizar badge" })
	@ApiResponse({ status: 200, description: "Badge atualizado com sucesso" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateBadgeDto: UpdateBadgeDto,
	) {
		return this.badgesService.update(id, updateBadgeDto);
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Remover badge" })
	@ApiResponse({ status: 200, description: "Badge removido com sucesso" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.badgesService.remove(id);
	}

	@Get("user/:userId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	getUserBadges(
		@Param("userId", ParseIntPipe) userId: number,
		@Query("roadmapId") roadmapId?: string,
	) {
		const roadmapIdNum = roadmapId ? parseInt(roadmapId, 10) : undefined;
		return this.badgesService.getUserBadges(userId, roadmapIdNum);
	}

	@Delete("user/:userId/badge/:badgeId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	removeBadgeFromUser(
		@Param("userId", ParseIntPipe) userId: number,
		@Param("badgeId", ParseIntPipe) badgeId: number,
	) {
		return this.badgesService.removeBadgeFromUser(userId, badgeId);
	}
}
