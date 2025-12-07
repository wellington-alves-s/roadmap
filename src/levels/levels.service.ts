/**
 * ⚠️  AVISO CRÍTICO - LEVELS SERVICE PROTEGIDO - NÃO ALTERAR ⚠️
 * 
 * Este serviço gerencia níveis e é parte crítica do sistema de roadmap.
 * 
 * 🔒 FUNCIONALIDADES PROTEGIDAS:
 * - Cache invalidation após operações CRUD
 * - Relacionamentos com tópicos
 * - Sistema de XP distribution
 * - Transações para exclusão segura
 * 
 * ⛔ NÃO ALTERAR SEM AUTORIZAÇÃO EXPRESSA
 * ⛔ NÃO MODIFICAR LÓGICA DE CACHE
 * ⛔ NÃO ALTERAR RELACIONAMENTOS COM TÓPICOS
 * ⛔ NÃO MODIFICAR SISTEMA DE TRANSAÇÕES
 * 
 * 📅 Última atualização: Sistema funcional e validado
 * 🔐 Status: ✅ PROTEGIDO - FUNCIONANDO PERFEITAMENTE
 */

import { Injectable, Logger, NotFoundException, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLevelDto } from "./dto/create-level.dto";
import { UpdateLevelDto } from "./dto/update-level.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { XpDistributionService } from "./xp-distribution.service";

@Injectable()
export class LevelsService {
	private readonly logger = new Logger(LevelsService.name);

	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private xpDistributionService: XpDistributionService,
	) {}

	async create(createLevelDto: CreateLevelDto) {
		this.logger.log("Creating new level");

		const level = await this.prisma.level.create({
			data: createLevelDto,
		});

		// Se o nível tem totalXp definido e já tem tópicos, distribuir XP automaticamente
		if (createLevelDto.totalXp) {
			const topics = await this.prisma.topic.findMany({
				where: { levelId: level.id },
			});

			if (topics.length > 0) {
				await this.xpDistributionService.distributeXpToTopics(
					level.id,
					createLevelDto.totalXp,
				);
			}
		}

		// Invalidate all related caches
		await Promise.all([
			this.cacheManager.del("levels"),
			this.cacheManager.del("topics"),
			this.cacheManager.del(`level:${level.id}`),
			this.cacheManager.del("dashboard"),
		]);

		return level;
	}

	async findAll() {
		this.logger.log("Fetching levels from database with fresh data");

		const levels = await this.prisma.level.findMany({
			include: {
				topic: {
					orderBy: {
						xp: "asc"
					}
				},
				_count: {
					select: {
						topic: true,
					},
				},
			},
			orderBy: {
				id: "asc", // Order by ID to ensure correct sequence (1, 2, 3, 4, 5...)
			},
		});

		this.logger.log(`Found ${levels.length} levels with topics`);
		levels.forEach(level => {
			this.logger.log(`Level ${level.name}: ${level.topic.length} topics`);
		});

		// Cache the result for 1 minute only to ensure fresh data
		await this.cacheManager.set("levels", levels, 60000);

		return levels;
	}

	async findOne(id: number) {
		// Try to get from cache first
		const cacheKey = `level:${id}`;
		const cachedLevel = await this.cacheManager.get(cacheKey);
		if (cachedLevel) {
			this.logger.debug(`Returning level ${id} from cache`);
			return cachedLevel as any;
		}

		this.logger.log(`Fetching level ${id} from database`);

		const level = await this.prisma.level.findUnique({
			where: { id },
			include: {
				topic: true,
			},
		});

		if (!level) {
			throw new NotFoundException("Nível não encontrado");
		}

		// Cache the result for 5 minutes
		await this.cacheManager.set(cacheKey, level, 300000);

		return level;
	}

	async update(id: number, updateLevelDto: UpdateLevelDto) {
		const level = await this.prisma.level.findUnique({
			where: { id },
		});

		if (!level) {
			throw new NotFoundException("Nível não encontrado");
		}

		const updatedLevel = await this.prisma.level.update({
			where: { id },
			data: updateLevelDto,
		});

		// Se o totalXp foi atualizado e há tópicos, redistribuir XP automaticamente
		if (updateLevelDto.totalXp !== undefined) {
			const topics = await this.prisma.topic.findMany({
				where: { levelId: id },
			});

			if (topics.length > 0) {
				await this.xpDistributionService.distributeXpToTopics(id, updateLevelDto.totalXp);
			}
		}

		// Invalidate cache
		await this.cacheManager.del("levels");
		await this.cacheManager.del(`level:${id}`);

		return updatedLevel;
	}

	async remove(id: number) {
		const level = await this.prisma.level.findUnique({
			where: { id },
			include: {
				topic: {
					include: {
						progress: true
					}
				}
			}
		});

		if (!level) {
			throw new NotFoundException("Nível não encontrado");
		}

		// Usar uma transação para garantir que todas as operações sejam executadas ou nenhuma
		await this.prisma.$transaction(async (prisma) => {
			// 1. Excluir todos os registros de progresso dos tópicos
			for (const topic of level.topic) {
				if (topic.progress.length > 0) {
					await prisma.progress.deleteMany({
						where: { topicId: topic.id }
					});
				}
			}

			// 2. Excluir todos os tópicos do nível
			await prisma.topic.deleteMany({
				where: { levelId: id }
			});

			// 3. Finalmente, excluir o nível
			await prisma.level.delete({
				where: { id }
			});
		});

		// Invalidate all related caches
		await Promise.all([
			this.cacheManager.del("levels"),
			this.cacheManager.del(`level:${id}`),
			this.cacheManager.del("topics"),
			this.cacheManager.del("dashboard"),
			this.cacheManager.del("progress"),
		]);

		return { message: "Nível e seus tópicos excluídos com sucesso" };
	}

	async getNextLevel(currentXp: number) {
		const levels = await this.findAll();

		return (levels as any[]).find((level) => level.xpNeeded > currentXp);
	}

	async getCurrentLevel(currentXp: number) {
		const levels = await this.findAll();

		// Encontrar o nível atual (maior nível onde o usuário tem XP suficiente)
		let currentLevel: any = null;
		for (const level of levels as any[]) {
			if (currentXp >= level.xpNeeded) {
				currentLevel = level;
			} else {
				break;
			}
		}

		return currentLevel;
	}
}
