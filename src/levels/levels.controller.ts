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
import { LevelsService } from "./levels.service";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { XpDistributionService } from "./xp-distribution.service";

@Controller("levels")
export class LevelsController {
	constructor(
		private readonly levelsService: LevelsService,
		private readonly xpDistributionService: XpDistributionService,
	) {}

	@Post()
	@Version("1")
	@UseGuards(JwtAuthGuard)
	create(@Body() createLevelDto: CreateLevelDto) {
		return this.levelsService.create(createLevelDto);
	}

	@Get()
	@Version("1")
	findAll() {
		return this.levelsService.findAll();
	}

	@Get(":id")
	@Version("1")
	findOne(@Param("id") id: string) {
		return this.levelsService.findOne(+id);
	}

	@Patch(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	update(@Param("id") id: string, @Body() updateLevelDto: UpdateLevelDto) {
		return this.levelsService.update(+id, updateLevelDto);
	}

	@Delete(":id")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	remove(@Param("id") id: string) {
		console.log("Tentando excluir nível:", id);
		return this.levelsService.remove(+id);
	}

	@Post("redistribute-xp")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	async redistributeAllXp() {
		console.log("🔄 Iniciando redistribuição global de XP...");
		
		// Buscar todos os níveis que têm totalXp definido
		const levels = await this.levelsService.findAll();
		const levelsWithXp = levels.filter(level => level.totalXp && level.totalXp > 0);
		
		if (levelsWithXp.length === 0) {
			return { 
				message: "Nenhum nível tem XP total definido para redistribuição",
				redistributedLevels: 0
			};
		}
		
		let redistributedCount = 0;
		const results: string[] = [];
		
		// Redistribuir XP para cada nível que tem totalXp
		for (const level of levelsWithXp) {
			try {
				await this.xpDistributionService.recalculateXpDistribution(level.id);
				redistributedCount++;
				results.push(`Nível "${level.name}": ${level.totalXp} XP redistribuído`);
				console.log(`✅ XP redistribuído para nível ${level.id} (${level.name})`);
			} catch (error) {
				console.error(`❌ Erro ao redistribuir XP do nível ${level.id}:`, error);
				results.push(`Nível "${level.name}": Erro na redistribuição`);
			}
		}
		
		console.log(`🎯 Redistribuição concluída: ${redistributedCount}/${levelsWithXp.length} níveis`);
		
		return { 
			message: `XP redistribuído com sucesso em ${redistributedCount} níveis`,
			redistributedLevels: redistributedCount,
			totalLevels: levelsWithXp.length,
			details: results
		};
	}

	@Post(":id/redistribute-xp")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	async redistributeXp(@Param("id") id: string) {
		const levelId = +id;
		const level = await this.levelsService.findOne(levelId);

		if (!level.totalXp) {
			return { message: "Este nível não tem XP total definido" };
		}

		await this.xpDistributionService.recalculateXpDistribution(levelId);
		return { message: "XP redistribuído com sucesso" };
	}
}
