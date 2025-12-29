import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BadgesService {
	private readonly logger = new Logger(BadgesService.name);

	constructor(private prisma: PrismaService) {}

	async findAll() {
		return this.prisma.badge.findMany({
			include: {
				_count: {
					select: {
						userbadge: true,
					},
				},
			},
		});
	}

	async findOne(id: number) {
		const badge = await this.prisma.badge.findUnique({
			where: { id },
			include: {
				userbadge: {
					include: {
						user: {
							select: {
								id: true,
								email: true,
							},
						},
					},
				},
			},
		});

		if (!badge) {
			throw new NotFoundException("Badge não encontrado");
		}

		return badge;
	}

	async getUserBadges(userId: number, roadmapId?: number) {
		this.logger.log(
			`Getting badges for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
		);

		// First check if user exists
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			this.logger.warn(`User ${userId} not found when getting badges`);
			return [];
		}

		// Construir filtro de progresso por roadmap
		const progressWhere: any = { userId, completed: true };
		if (roadmapId) {
			progressWhere.topic = {
				level: {
					roadmapId,
				},
			};
		}

		// Get user's progress to check completed levels (filtrado por roadmap se fornecido)
		const userProgress = await this.prisma.progress.findMany({
			where: progressWhere,
			include: { topic: { include: { level: true } } },
		});

		this.logger.log(
			`Found ${userProgress.length} completed topics for user ${userId}${roadmapId ? ` in roadmap ${roadmapId}` : ""}`,
		);

		// Get completed level IDs (apenas do roadmap atual se fornecido)
		const completedLevelIds = new Set();
		for (const progress of userProgress) {
			const levelId = progress.topic.levelId;
			const levelWhere: any = { levelId };
			if (roadmapId) {
				levelWhere.level = { roadmapId };
			}
			const levelTopics = await this.prisma.topic.count({
				where: levelWhere,
			});
			const completedTopics = userProgress.filter((p) => p.topic.levelId === levelId).length;

			if (completedTopics === levelTopics) {
				completedLevelIds.add(levelId);
				this.logger.log(
					`Level ${levelId} is completed (${completedTopics}/${levelTopics} topics)`,
				);
			}
		}

		// Get user's badges (filtrado por roadmap se fornecido)
		const badgeWhere: any = { userId };
		if (roadmapId) {
			badgeWhere.roadmapId = roadmapId;
		}
		const userBadges = await this.prisma.userbadge.findMany({
			where: badgeWhere,
			include: {
				badge: true,
			},
		});

		this.logger.log(`Found ${userBadges.length} badges for user ${userId}`);

		// Check if any completed levels don't have badges awarded (apenas badges do roadmap atual)
		for (const levelId of completedLevelIds) {
			const badgeWhere: any = {
				name: {
					startsWith: `Nível ${levelId}`,
				},
			};
			if (roadmapId) {
				badgeWhere.roadmapId = roadmapId;
			}
			const levelBadge = await this.prisma.badge.findFirst({
				where: badgeWhere,
			});

			if (levelBadge) {
				const hasLevelBadge = userBadges.some((ub) => ub.badgeId === levelBadge.id);
				if (!hasLevelBadge) {
					this.logger.warn(
						`User ${userId} completed level ${levelId} but doesn't have the badge. Awarding now.`,
					);
					await this.awardBadgeToUser(userId, levelBadge.id, roadmapId);
				}
			}
		}

		// Get updated badges after potential new awards (filtrado por roadmap se fornecido)
		const updatedBadgeWhere: any = { userId };
		if (roadmapId) {
			updatedBadgeWhere.roadmapId = roadmapId;
		}
		const updatedUserBadges = await this.prisma.userbadge.findMany({
			where: updatedBadgeWhere,
			include: {
				badge: true,
			},
		});

		this.logger.log(`Returning ${updatedUserBadges.length} badges for user ${userId}`);

		return updatedUserBadges.map((userBadge) => ({
			id: userBadge.badge.id,
			name: userBadge.badge.name,
			description: userBadge.badge.description,
			icon: userBadge.badge.icon,
			category: userBadge.badge.category,
			earnedAt: userBadge.earnedAt,
			roadmapId: userBadge.roadmapId, // Incluir roadmapId para filtro no frontend
			badge: {
				id: userBadge.badge.id,
				name: userBadge.badge.name,
				description: userBadge.badge.description,
				icon: userBadge.badge.icon,
				category: userBadge.badge.category,
				roadmapId: userBadge.badge.roadmapId,
			},
		}));
	}

	async awardBadgeToUser(userId: number, badgeId: number, roadmapId?: number) {
		// Buscar o badge para obter o roadmapId se não foi fornecido
		if (!roadmapId) {
			const badge = await this.prisma.badge.findUnique({
				where: { id: badgeId },
			});
			roadmapId = badge?.roadmapId || undefined;
		}

		// Check if user already has this badge in this roadmap
		const existingUserBadge = await this.prisma.userbadge.findFirst({
			where: {
				userId,
				badgeId,
				roadmapId: roadmapId || undefined,
			},
		});

		if (existingUserBadge) {
			this.logger.log(`User ${userId} already has badge ${badgeId} in roadmap ${roadmapId}`);
			return existingUserBadge;
		}

		// Award the badge (com roadmapId)
		const userBadge = await this.prisma.userbadge.create({
			data: {
				userId,
				badgeId,
				roadmapId: roadmapId || undefined,
			},
			include: {
				badge: true,
			},
		});

		this.logger.log(`Badge ${badgeId} awarded to user ${userId} in roadmap ${roadmapId}`);

		// Create notification for the user (com roadmapId)
		await this.prisma.notification.create({
			data: {
				userId,
				title: "Novo Badge Conquistado! 🏅",
				message: `Parabéns! Você conquistou o badge "${userBadge.badge.name}"!`,
				type: "achievement",
				roadmapId: roadmapId || undefined,
			},
		});

		return userBadge;
	}

	async checkAndAwardLevelBadges(userId: number, levelId: number, roadmapId: number) {
		this.logger.log(
			`🔍 Checking level badges for user ${userId}, level ${levelId} in roadmap ${roadmapId}`,
		);

		// Get all topics for this level (apenas do roadmap atual)
		const allTopicsInLevel = await this.prisma.topic.findMany({
			where: {
				levelId,
				level: {
					roadmapId,
				},
			},
		});

		// Get user's progress for this level (apenas do roadmap atual)
		const userProgress = await this.prisma.progress.findMany({
			where: {
				userId,
				topic: {
					levelId,
					level: {
						roadmapId,
					},
				},
				completed: true, // Only get completed progress
			},
			include: {
				topic: true,
			},
		});

		this.logger.log(`📊 Level ${levelId} stats (roadmap ${roadmapId}):`);
		this.logger.log(`  - Total topics in level: ${allTopicsInLevel.length}`);
		this.logger.log(`  - Completed topics by user: ${userProgress.length}`);

		// Check if ALL topics in this level are completed
		const allTopicsCompleted =
			allTopicsInLevel.length > 0 && userProgress.length === allTopicsInLevel.length;

		this.logger.log(`  - All topics completed: ${allTopicsCompleted}`);

		if (allTopicsCompleted) {
			// Find the badge for this level (apenas do roadmap atual)
			const levelBadge = await this.prisma.badge.findFirst({
				where: {
					name: {
						startsWith: `Nível ${levelId}`,
					},
					roadmapId,
				},
			});

			if (levelBadge) {
				await this.awardBadgeToUser(userId, levelBadge.id, roadmapId);
				this.logger.log(
					`🏅 Level ${levelId} badge awarded to user ${userId} in roadmap ${roadmapId}`,
				);
			} else {
				this.logger.log(`❌ No badge found for level ${levelId} in roadmap ${roadmapId}`);
			}
		} else {
			this.logger.log(
				`⏳ Level ${levelId} not completed yet (${userProgress.length}/${allTopicsInLevel.length} topics done)`,
			);
		}
	}

	async removeBadgeFromUser(userId: number, badgeId: number) {
		this.logger.log(`🗑️ Removing badge ${badgeId} from user ${userId}`);

		const deletedUserBadge = await this.prisma.userbadge.deleteMany({
			where: {
				userId,
				badgeId,
			},
		});

		this.logger.log(`✅ Removed ${deletedUserBadge.count} badge(s) from user ${userId}`);
		return deletedUserBadge;
	}

	async checkAndAwardFinalBadge(userId: number, roadmapId: number) {
		this.logger.log(`Checking final badge for user ${userId} in roadmap ${roadmapId}`);

		// Get all user's completed topics (apenas do roadmap atual)
		const userProgress = await this.prisma.progress.findMany({
			where: {
				userId,
				completed: true,
				topic: {
					level: {
						roadmapId,
					},
				},
			},
			include: {
				topic: {
					include: {
						level: true,
					},
				},
			},
		});

		// Get all levels (apenas do roadmap atual)
		const allLevels = await this.prisma.level.findMany({
			where: { roadmapId },
		});
		const completedLevels = new Set(userProgress.map((progress) => progress.topic.levelId));

		// Check if user completed all levels (apenas do roadmap atual)
		const allLevelsCompleted = allLevels.every((level) => completedLevels.has(level.id));

		if (allLevelsCompleted) {
			// Find the final badge (apenas do roadmap atual)
			const finalBadge = await this.prisma.badge.findFirst({
				where: {
					name: {
						contains: "Full-Stack Master Internacional",
					},
					roadmapId,
				},
			});

			if (finalBadge) {
				await this.awardBadgeToUser(userId, finalBadge.id, roadmapId);
				this.logger.log(`Final badge awarded to user ${userId} in roadmap ${roadmapId}`);
			}
		}
	}
}
