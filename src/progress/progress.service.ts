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
			include: {
				level: {
					include: {
						roadmap: true,
					},
				},
			},
		});

		if (!topic) {
			this.logger.warn(`Topic ${topicId} not found`);
			throw new NotFoundException("Tópico não encontrado");
		}

		const roadmapId = topic.level.roadmapId;
		this.logger.log(`📌 Roadmap ID do tópico: ${roadmapId}`);

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

		// Criar notificação de conclusão (com roadmapId)
		await this.createCompletionNotification(userId, topic, roadmapId);

		// Verificar se deve conceder badges (com roadmapId)
		await this.checkAndAwardBadges(userId, topic.levelId, roadmapId);

		this.logger.log(`Topic ${topicId} completed successfully by user ${userId}`);

		return {
			...progress,
			xpGained: topic.xp,
		};
	}

	async resetProgress(userId: number, topicIds?: number[]) {
		this.logger.log(
			`🔄 Resetting progress for user ${userId}${topicIds ? ` (filtered by ${topicIds.length} topics)` : " (all progress)"}`,
		);

		try {
			// Verificar se o usuário existe
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
			});

			if (!user) {
				this.logger.error(`❌ User ${userId} not found`);
				throw new Error("Usuário não encontrado");
			}

			this.logger.log(`✅ User ${userId} found, proceeding with reset`);

			// Construir where clause para progresso
			const progressWhere: any = { userId };
			if (topicIds && topicIds.length > 0) {
				progressWhere.topicId = { in: topicIds };
			}

			// Deletar progresso do usuário (filtrado por topicIds se fornecido)
			this.logger.log(
				`🗑️ Deleting progress for user ${userId}${topicIds ? ` (topics: ${topicIds.join(", ")})` : ""}`,
			);
			const deletedCount = await this.prisma.progress.deleteMany({
				where: progressWhere,
			});
			this.logger.log(`✅ Deleted ${deletedCount.count} progress records`);

			// Obter roadmapId dos tópicos se topicIds foram fornecidos
			let roadmapId: number | undefined = undefined;
			if (topicIds && topicIds.length > 0) {
				const firstTopic = await this.prisma.topic.findUnique({
					where: { id: topicIds[0] },
					include: { level: true },
				});
				if (firstTopic) {
					roadmapId = firstTopic.level.roadmapId;
					this.logger.log(`📌 Roadmap ID identificado: ${roadmapId}`);
				}
			}

			// Deletar badges, conquistas, desafios e notificações (filtrado por roadmap se fornecido)
			let deletedBadges = { count: 0 };
			let deletedAchievements = { count: 0 };
			let deletedChallenges = { count: 0 };

			// Construir where clause para badges
			const badgeWhere: any = { userId };
			if (roadmapId) {
				badgeWhere.roadmapId = roadmapId;
			}
			this.logger.log(
				`🗑️ Deleting badges for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
			);
			deletedBadges = await this.prisma.userbadge.deleteMany({
				where: badgeWhere,
			});
			this.logger.log(`✅ Deleted ${deletedBadges.count} user badges`);

			// Construir where clause para achievements
			const achievementWhere: any = { userId };
			if (roadmapId) {
				achievementWhere.roadmapId = roadmapId;
			}
			this.logger.log(
				`🗑️ Deleting achievements for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
			);
			deletedAchievements = await this.prisma.userachievement.deleteMany({
				where: achievementWhere,
			});
			this.logger.log(`✅ Deleted ${deletedAchievements.count} user achievements`);

			// Construir where clause para challenges
			const challengeWhere: any = { userId };
			if (roadmapId) {
				challengeWhere.roadmapId = roadmapId;
			}
			this.logger.log(
				`🗑️ Deleting challenges for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
			);
			deletedChallenges = await this.prisma.userchallenge.deleteMany({
				where: challengeWhere,
			});
			this.logger.log(`✅ Deleted ${deletedChallenges.count} user challenges`);

			// Construir where clause para notifications
			const notificationWhere: any = { userId };
			if (roadmapId) {
				notificationWhere.roadmapId = roadmapId;
			}
			this.logger.log(
				`🗑️ Deleting notifications for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
			);
			const deletedNotifications = await this.prisma.notification.deleteMany({
				where: notificationWhere,
			});
			this.logger.log(`✅ Deleted ${deletedNotifications.count} user notifications`);

			// Resetar streak apenas se resetando tudo (sem topicIds)
			if (!topicIds || topicIds.length === 0) {
				this.logger.log(`🔄 Resetting user streak for user ${userId}`);
				await this.prisma.user.update({
					where: { id: userId },
					data: {
						currentStreak: 0,
						lastActivityDate: null,
					},
				});
				this.logger.log(`✅ User streak reset`);
			}

			const result = {
				message:
					topicIds && topicIds.length > 0
						? `Progresso de ${deletedCount.count} tópicos do roadmap, ${deletedBadges.count} badges, ${deletedAchievements.count} conquistas, ${deletedChallenges.count} desafios e ${deletedNotifications.count} notificações resetados com sucesso`
						: "Progresso, badges, conquistas, desafios e notificações resetados com sucesso",
				deletedProgress: deletedCount.count,
				deletedBadges: deletedBadges.count,
				deletedAchievements: deletedAchievements.count,
				deletedChallenges: deletedChallenges.count,
				deletedNotifications: deletedNotifications.count,
			};

			this.logger.log(`✅ Progress reset successfully for user ${userId}:`, result);

			return result;
		} catch (error) {
			this.logger.error(`❌ Error resetting progress for user ${userId}:`, error);
			throw error;
		}
	}

	async getUserStats(userId: number) {
		this.logger.log(`Getting stats for user ${userId}`);

		try {
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

			// Calcular XP total (com proteção contra null)
			const totalXp = progress
				.filter((p) => p.completed && p.topic)
				.reduce((sum, p) => sum + (p.topic?.xp || 0), 0);

			// Buscar níveis
			const levels = await this.levelsService.findAll();

			// Encontrar nível atual baseado no progresso real
			let currentLevel: any = null;
			let progressToNextLevel = 0;

			// Ordenar níveis por ID
			const sortedLevels = (levels as any[]).sort((a, b) => a.id - b.id);

			for (const level of sortedLevels) {
				// Usar topic (singular) conforme schema do Prisma
				const levelTopics = level.topic || [];
				const completedTopicsInLevel = progress.filter(
					(p) => p.completed && levelTopics.some((topic: any) => topic.id === p.topicId),
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
		} catch (error) {
			this.logger.error(`Error in getUserStats for user ${userId}:`, error);
			this.logger.error(
				`Error stack:`,
				error instanceof Error ? error.stack : "No stack trace",
			);
			throw error;
		}
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

	private async createCompletionNotification(userId: number, topic: any, roadmapId: number) {
		await this.prisma.notification.create({
			data: {
				userId,
				title: "Tópico Concluído!",
				message: `Parabéns! Você concluiu "${topic.name}" e ganhou ${topic.xp} XP!`,
				type: "achievement",
				roadmapId: roadmapId || undefined,
			},
		});
	}

	private async checkAndAwardBadges(userId: number, levelId: number, roadmapId: number) {
		try {
			// Verificar badge do nível (com roadmapId)
			await this.badgesService.checkAndAwardLevelBadges(userId, levelId, roadmapId);

			// Verificar badge final (com roadmapId)
			await this.badgesService.checkAndAwardFinalBadge(userId, roadmapId);

			// Verificar conquistas (com roadmapId)
			await this.achievementsService.checkAndAwardAchievements(userId, roadmapId);

			// Limpar possíveis duplicatas (proteção extra)
			await this.achievementsService.cleanDuplicateAchievements(userId);
		} catch (error) {
			this.logger.error(`Error checking badges and achievements for user ${userId}:`, error);
		}
	}
}
