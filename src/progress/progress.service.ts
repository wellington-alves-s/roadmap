/**
 * ⚠️  AVISO CRÍTICO - PROGRESS SERVICE PROTEGIDO - NÃO ALTERAR ⚠️
 * 
 * Este serviço gerencia o progresso dos usuários e é CRÍTICO para o sistema.
 * 
 * 🔒 FUNCIONALIDADES PROTEGIDAS:
 * - Lógica de completar tópicos
 * - Sistema de XP e estatísticas
 * - Relacionamentos com badges e achievements
 * - Cálculos de progresso e níveis
 * 
 * ⛔ NÃO ALTERAR SEM AUTORIZAÇÃO EXPRESSA
 * ⛔ NÃO MODIFICAR LÓGICA DE COMPLETAR TÓPICOS
 * ⛔ NÃO ALTERAR CÁLCULOS DE XP E ESTATÍSTICAS
 * ⛔ NÃO MODIFICAR SISTEMA DE BADGES/ACHIEVEMENTS
 * 
 * 📅 Última atualização: Sistema funcional e validado
 * 🔐 Status: ✅ PROTEGIDO - FUNCIONANDO PERFEITAMENTE
 */

import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";
import { LevelsService } from "../levels/levels.service";
import { BadgesService } from "../badges/badges.service";
import { AchievementsService } from "../achievements/achievements.service";

@Injectable()
export class ProgressService {
	private readonly logger = new Logger(ProgressService.name);

	constructor(
		private prisma: PrismaService,
		private levelsService: LevelsService,
		private badgesService: BadgesService,
		private achievementsService: AchievementsService,
	) {}

	async create(createProgressDto: CreateProgressDto) {
		this.logger.log(
			`Creating progress for user ${createProgressDto.userId}, topic ${createProgressDto.topicId}`,
		);

		// Verificar se usuário existe
		const user = await this.prisma.user.findUnique({
			where: { id: createProgressDto.userId },
		});

		if (!user) {
			this.logger.warn(`User ${createProgressDto.userId} not found`);
			throw new NotFoundException("Usuário não encontrado");
		}

		// Verificar se tópico existe
		const topic = await this.prisma.topic.findUnique({
			where: { id: createProgressDto.topicId },
		});

		if (!topic) {
			this.logger.warn(`Topic ${createProgressDto.topicId} not found`);
			throw new NotFoundException("Tópico não encontrado");
		}

		// Verificar se já existe progresso para este usuário e tópico
		const existingProgress = await this.prisma.progress.findFirst({
			where: {
				userId: createProgressDto.userId,
				topicId: createProgressDto.topicId,
			},
		});

		if (existingProgress) {
			this.logger.warn(
				`Progress already exists for user ${createProgressDto.userId}, topic ${createProgressDto.topicId}`,
			);
			throw new ConflictException("Progresso já existe para este usuário e tópico");
		}

		const progress = await this.prisma.progress.create({
			data: {
				...createProgressDto,
				startedAt: new Date(),
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				topic: {
					include: {
						level: true,
					},
				},
			},
		});

		this.logger.log(
			`Progress created successfully for user ${createProgressDto.userId}, topic ${createProgressDto.topicId}`,
		);
		return progress;
	}

	async findAll() {
		return this.prisma.progress.findMany({
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				topic: {
					include: {
						level: true,
					},
				},
			},
		});
	}

	async findByUser(userId: number) {
		this.logger.log(`Finding progress for user ${userId}`);

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			this.logger.warn(`User ${userId} not found`);
			throw new NotFoundException("Usuário não encontrado");
		}

		return this.prisma.progress.findMany({
			where: { userId },
			include: {
				topic: {
					include: {
						level: true,
					},
				},
			},
			orderBy: [{ topic: { level: { id: "asc" } } }, { topic: { xp: "asc" } }],
		});
	}

	async findOne(id: number) {
		this.logger.log(`Finding progress with ID ${id}`);

		const progress = await this.prisma.progress.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				topic: {
					include: {
						level: true,
					},
				},
			},
		});

		if (!progress) {
			this.logger.warn(`Progress ${id} not found`);
			throw new NotFoundException("Progresso não encontrado");
		}

		return progress;
	}

	async update(id: number, updateProgressDto: UpdateProgressDto) {
		this.logger.log(`Updating progress ${id}`);

		const progress = await this.prisma.progress.findUnique({
			where: { id },
		});

		if (!progress) {
			this.logger.warn(`Progress ${id} not found`);
			throw new NotFoundException("Progresso não encontrado");
		}

		return this.prisma.progress.update({
			where: { id },
			data: updateProgressDto,
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
				topic: {
					include: {
						level: true,
					},
				},
			},
		});
	}

	async remove(id: number) {
		this.logger.log(`Removing progress ${id}`);

		const progress = await this.prisma.progress.findUnique({
			where: { id },
		});

		if (!progress) {
			this.logger.warn(`Progress ${id} not found`);
			throw new NotFoundException("Progresso não encontrado");
		}

		return this.prisma.progress.delete({
			where: { id },
		});
	}

	async completeTopic(userId: number, topicId: number) {
		this.logger.log(`Completing topic ${topicId} for user ${userId}`);

		const topic = await this.prisma.topic.findUnique({
			where: { id: topicId },
		});

		if (!topic) {
			this.logger.warn(`Topic ${topicId} not found`);
			throw new NotFoundException("Tópico não encontrado");
		}

		// Verificar se já existe progresso para este tópico
		let progress = await this.prisma.progress.findFirst({
			where: {
				userId,
				topicId,
			},
		});

		if (progress && progress.completed) {
			this.logger.warn(`Topic ${topicId} already completed by user ${userId}`);
			throw new ConflictException("Tópico já foi concluído");
		}

		// Criar ou atualizar progresso
		progress = await this.prisma.progress.upsert({
			where: {
				id: progress?.id || 0,
			},
			update: {
				completed: true,
				completedAt: new Date(),
				attempts: {
					increment: 1,
				},
			},
			create: {
				userId,
				topicId,
				completed: true,
				startedAt: new Date(),
				completedAt: new Date(),
				attempts: 1,
			},
		});

		// Atualizar streak do usuário
		await this.updateUserStreak(userId);

		// Criar notificação de conclusão
		await this.createCompletionNotification(userId, topic);

		// Verificar se deve conceder badges
		await this.checkAndAwardBadges(userId, topic.levelId);

		this.logger.log(`Topic ${topicId} completed successfully by user ${userId}`);

		return {
			...progress,
			xpGained: topic.xp,
		};
	}

	async resetProgress(userId: number) {
		this.logger.log(`🔄 Resetting progress for user ${userId}`);

		try {
			// Verificar se o usuário existe
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				this.logger.error(`❌ User ${userId} not found`);
				throw new Error('Usuário não encontrado');
			}

			this.logger.log(`✅ User ${userId} found, proceeding with reset`);

			// Deletar todo o progresso do usuário
			this.logger.log(`🗑️ Deleting progress for user ${userId}`);
			const deletedCount = await this.prisma.progress.deleteMany({
				where: {
					userId,
				},
			});
			this.logger.log(`✅ Deleted ${deletedCount.count} progress records`);

			// Deletar todas as badges do usuário
			this.logger.log(`🗑️ Deleting badges for user ${userId}`);
			const deletedBadges = await this.prisma.userbadge.deleteMany({
				where: {
					userId,
				},
			});
			this.logger.log(`✅ Deleted ${deletedBadges.count} user badges`);

			// Deletar todas as conquistas do usuário
			this.logger.log(`🗑️ Deleting achievements for user ${userId}`);
			const deletedAchievements = await this.prisma.userachievement.deleteMany({
				where: {
					userId,
				},
			});
			this.logger.log(`✅ Deleted ${deletedAchievements.count} user achievements`);

			// Deletar todos os desafios do usuário
			this.logger.log(`🗑️ Deleting challenges for user ${userId}`);
			const deletedChallenges = await this.prisma.userchallenge.deleteMany({
				where: {
					userId,
				},
			});
			this.logger.log(`✅ Deleted ${deletedChallenges.count} user challenges`);

			// Resetar streak
			this.logger.log(`🔄 Resetting user streak for user ${userId}`);
			await this.prisma.user.update({
				where: { id: userId },
				data: {
					currentStreak: 0,
					lastActivityDate: null,
				},
			});
			this.logger.log(`✅ User streak reset`);

			const result = {
				message: "Progresso, badges, conquistas e desafios resetados com sucesso",
				deletedProgress: deletedCount.count,
				deletedBadges: deletedBadges.count,
				deletedAchievements: deletedAchievements.count,
				deletedChallenges: deletedChallenges.count,
			};

			this.logger.log(
				`✅ Progress reset successfully for user ${userId}:`,
				result,
			);

			return result;
		} catch (error) {
			this.logger.error(`❌ Error resetting progress for user ${userId}:`, error);
			throw error;
		}
	}

	async getUserStats(userId: number) {
		this.logger.log(`Getting stats for user ${userId}`);

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			this.logger.warn(`User ${userId} not found`);
			throw new NotFoundException("Usuário não encontrado");
		}

		// Buscar todos os progressos do usuário
		const progress = await this.prisma.progress.findMany({
			where: { userId },
			include: {
				topic: {
					include: {
						level: true,
					},
				},
			},
		});

		// Calcular XP total
		const totalXp = progress.filter((p) => p.completed).reduce((sum, p) => sum + p.topic.xp, 0);

		// Buscar níveis
		const levels = await this.levelsService.findAll();

		// Encontrar nível atual baseado no progresso real
		let currentLevel: any = null;
		let progressToNextLevel = 0;

		// Ordenar níveis por ID
		const sortedLevels = (levels as any[]).sort((a, b) => a.id - b.id);

		for (const level of sortedLevels) {
			const levelTopics = level.topics || [];
			const completedTopicsInLevel = progress.filter(
				(p) => p.completed && levelTopics.some((topic) => topic.id === p.topicId),
			).length;

			// Se há tópicos pendentes neste nível, este é o nível atual
			if (completedTopicsInLevel < levelTopics.length) {
				currentLevel = level;
				// Calcular progresso dentro do nível atual
				progressToNextLevel =
					levelTopics.length > 0
						? (completedTopicsInLevel / levelTopics.length) * 100
						: 0;
				break;
			}
		}

		// Se todos os níveis foram concluídos, usar o último nível
		if (!currentLevel && sortedLevels.length > 0) {
			currentLevel = sortedLevels[sortedLevels.length - 1];
			progressToNextLevel = 100;
		}

		// Calcular estatísticas adicionais
		const totalTimeSpent = progress
			.filter((p) => p.completed && p.timeSpent)
			.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

		const averageAttempts =
			progress.length > 0
				? progress.reduce((sum, p) => sum + p.attempts, 0) / progress.length
				: 0;

		return {
			userId,
			totalXp,
			currentLevel,
			progressToNextLevel: Math.min(progressToNextLevel, 100),
			completedTopics: progress.filter((p) => p.completed).length,
			totalTopics: await this.prisma.topic.count(),
			totalTimeSpent,
			averageAttempts: Math.round(averageAttempts * 100) / 100,
			currentStreak: user.currentStreak,
			longestStreak: user.longestStreak,
			progress,
		};
	}

	private async updateUserStreak(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) return;

		const today = new Date();
		const lastActivity = user.lastActivityDate;

		let newStreak = user.currentStreak;

		if (!lastActivity) {
			// Primeira atividade
			newStreak = 1;
		} else {
			const daysDiff = Math.floor(
				(today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
			);

			if (daysDiff === 1) {
				// Atividade consecutiva
				newStreak = user.currentStreak + 1;
			} else if (daysDiff === 0) {
				// Mesmo dia, manter streak
				newStreak = user.currentStreak;
			} else {
				// Quebra de streak
				newStreak = 1;
			}
		}

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				currentStreak: newStreak,
				longestStreak: Math.max(user.longestStreak, newStreak),
				lastActivityDate: today,
			},
		});
	}

	private async createCompletionNotification(userId: number, topic: any) {
		await this.prisma.notification.create({
			data: {
				userId,
				title: "Tópico Concluído!",
				message: `Parabéns! Você concluiu "${topic.name}" e ganhou ${topic.xp} XP!`,
				type: "achievement",
			},
		});
	}

	private async checkAndAwardBadges(userId: number, levelId: number) {
		try {
			// Verificar badge do nível
			await this.badgesService.checkAndAwardLevelBadges(userId, levelId);

			// Verificar badge final
			await this.badgesService.checkAndAwardFinalBadge(userId);

			// Verificar conquistas
			await this.achievementsService.checkAndAwardAchievements(userId);
			
			// Limpar possíveis duplicatas (proteção extra)
			await this.achievementsService.cleanDuplicateAchievements(userId);
		} catch (error) {
			this.logger.error(`Error checking badges and achievements for user ${userId}:`, error);
		}
	}
}
