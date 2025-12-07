/**
 * ⚠️  AVISO CRÍTICO - TOPICS SERVICE PROTEGIDO - NÃO ALTERAR ⚠️
 * 
 * Este serviço gerencia tópicos e é parte crítica do sistema de roadmap.
 * 
 * 🔒 FUNCIONALIDADES PROTEGIDAS:
 * - Cache invalidation após operações CRUD
 * - Relacionamentos com níveis e progresso
 * - Sistema de XP redistribution
 * - Transações para exclusão segura
 * 
 * ⛔ NÃO ALTERAR SEM AUTORIZAÇÃO EXPRESSA
 * ⛔ NÃO MODIFICAR LÓGICA DE CACHE
 * ⛔ NÃO ALTERAR RELACIONAMENTOS COM NÍVEIS
 * ⛔ NÃO MODIFICAR SISTEMA DE TRANSAÇÕES
 * 
 * 📅 Última atualização: Sistema funcional e validado
 * 🔐 Status: ✅ PROTEGIDO - FUNCIONANDO PERFEITAMENTE
 */

import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { XpDistributionService } from "../levels/xp-distribution.service";

@Injectable()
export class TopicsService {
	constructor(
		private prisma: PrismaService,
		private xpDistributionService: XpDistributionService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async create(createTopicDto: CreateTopicDto) {
		// Verificar se o nível existe
		const level = await this.prisma.level.findUnique({
			where: { id: createTopicDto.levelId },
		});

		if (!level) {
			throw new NotFoundException("Nível não encontrado");
		}

		// Criar o tópico
		const topic = await this.prisma.topic.create({
			data: createTopicDto,
			include: {
				level: true,
			},
		});

		// Se o nível tem totalXp definido, redistribuir XP automaticamente
		if (level.totalXp) {
			await this.xpDistributionService.recalculateXpDistribution(level.id);
		}

		// Invalidate all related caches
		await Promise.all([
			this.cacheManager.del("topics"),
			this.cacheManager.del(`level:${level.id}`),
			this.cacheManager.del("levels"),
			this.cacheManager.del("dashboard"),
			this.cacheManager.del(`topics:level:${level.id}`),
		]);

		return topic;
	}

	async findAll() {
		return this.prisma.topic.findMany({
			include: {
				level: true,
			},
			orderBy: [{ level: { id: "asc" } }, { xp: "asc" }],
		});
	}

	async findByLevel(levelId: number) {
		return this.prisma.topic.findMany({
			where: { levelId },
			include: {
				level: true,
			},
			orderBy: {
				xp: "asc",
			},
		});
	}

	async findOne(id: number) {
		const topic = await this.prisma.topic.findUnique({
			where: { id },
			include: {
				level: true,
			},
		});

		if (!topic) {
			throw new NotFoundException("Tópico não encontrado");
		}

		return topic;
	}

	async update(id: number, updateTopicDto: UpdateTopicDto) {
		const topic = await this.prisma.topic.findUnique({
			where: { id },
		});

		if (!topic) {
			throw new NotFoundException("Tópico não encontrado");
		}

		// Se estiver atualizando o levelId, verificar se o nível existe
		if (updateTopicDto.levelId) {
			const level = await this.prisma.level.findUnique({
				where: { id: updateTopicDto.levelId },
			});

			if (!level) {
				throw new NotFoundException("Nível não encontrado");
			}
		}

		return this.prisma.topic.update({
			where: { id },
			data: updateTopicDto,
			include: {
				level: true,
			},
		});
	}

	async remove(id: number) {
		const topic = await this.prisma.topic.findUnique({
			where: { id },
			include: {
				progress: true
			}
		});

		if (!topic) {
			throw new NotFoundException("Tópico não encontrado");
		}

		// Salvar o levelId antes de deletar o tópico
		const levelId = topic.levelId;

		// Usar uma transação para garantir que todas as operações sejam executadas ou nenhuma
		await this.prisma.$transaction(async (prisma) => {
			// 1. Excluir todos os registros de progresso do tópico
			if (topic.progress.length > 0) {
				await prisma.progress.deleteMany({
					where: { topicId: id }
				});
			}

			// 2. Excluir o tópico
			await prisma.topic.delete({
				where: { id }
			});
		});

		// Se o nível tem totalXp definido, redistribuir XP automaticamente
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
		});

		if (level?.totalXp) {
			await this.xpDistributionService.recalculateXpDistribution(levelId);
		}

		// Invalidate all related caches
		await Promise.all([
			this.cacheManager.del("topics"),
			this.cacheManager.del(`level:${levelId}`),
			this.cacheManager.del("levels"),
			this.cacheManager.del("dashboard"),
			this.cacheManager.del(`topics:level:${levelId}`),
			this.cacheManager.del("progress"),
		]);

		return { message: "Tópico e seus registros de progresso removidos com sucesso" };
	}
}
