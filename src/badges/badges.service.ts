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

	async getUserBadges(userId: number) {
		this.logger.log(`Getting badges for user ${userId}`);

		// First check if user exists
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			this.logger.warn(`User ${userId} not found when getting badges`);
			return [];
		}

		// Get user's progress to check completed levels
		const userProgress = await this.prisma.progress.findMany({
			where: { userId, completed: true },
			include: { topic: { include: { level: true } } },
		});

		this.logger.log(`Found ${userProgress.length} completed topics for user ${userId}`);

		// Get completed level IDs
		const completedLevelIds = new Set();
		for (const progress of userProgress) {
			const levelId = progress.topic.levelId;
			const levelTopics = await this.prisma.topic.count({
				where: { levelId },
			});
			const completedTopics = userProgress.filter((p) => p.topic.levelId === levelId).length;

			if (completedTopics === levelTopics) {
				completedLevelIds.add(levelId);
				this.logger.log(
					`Level ${levelId} is completed (${completedTopics}/${levelTopics} topics)`,
				);
			}
		}

		// Get user's badges
		const userBadges = await this.prisma.userbadge.findMany({
			where: { userId },
			include: {
				badge: true,
			},
		});

		this.logger.log(`Found ${userBadges.length} badges for user ${userId}`);

		// Check if any completed levels don't have badges awarded
		for (const levelId of completedLevelIds) {
			const levelBadge = await this.prisma.badge.findFirst({
				where: {
					name: {
						startsWith: `Nível ${levelId}`,
					},
				},
			});

			if (levelBadge) {
				const hasLevelBadge = userBadges.some((ub) => ub.badgeId === levelBadge.id);
				if (!hasLevelBadge) {
					this.logger.warn(
						`User ${userId} completed level ${levelId} but doesn't have the badge. Awarding now.`,
					);
					await this.awardBadgeToUser(userId, levelBadge.id);
				}
			}
		}

		// Get updated badges after potential new awards
		const updatedUserBadges = await this.prisma.userbadge.findMany({
			where: { userId },
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
		}));
	}

	async awardBadgeToUser(userId: number, badgeId: number) {
		// Check if user already has this badge
		const existingUserBadge = await this.prisma.userbadge.findFirst({
			where: {
				userId,
				badgeId,
			},
		});

		if (existingUserBadge) {
			this.logger.log(`User ${userId} already has badge ${badgeId}`);
			return existingUserBadge;
		}

		// Award the badge
		const userBadge = await this.prisma.userbadge.create({
			data: {
				userId,
				badgeId,
			},
			include: {
				badge: true,
			},
		});

		this.logger.log(`Badge ${badgeId} awarded to user ${userId}`);

		// Create notification for the user
		await this.prisma.notification.create({
			data: {
				userId,
				title: "Novo Badge Conquistado! 🏅",
				message: `Parabéns! Você conquistou o badge "${userBadge.badge.name}"!`,
				type: "achievement",
			},
		});

		return userBadge;
	}

	async checkAndAwardLevelBadges(userId: number, levelId: number) {
		this.logger.log(`🔍 Checking level badges for user ${userId}, level ${levelId}`);

		// Get all topics for this level
		const allTopicsInLevel = await this.prisma.topic.findMany({
			where: {
				levelId,
			},
		});

		// Get user's progress for this level
		const userProgress = await this.prisma.progress.findMany({
			where: {
				userId,
				topic: {
					levelId,
				},
				completed: true, // Only get completed progress
			},
			include: {
				topic: true,
			},
		});

		this.logger.log(`📊 Level ${levelId} stats:`);
		this.logger.log(`  - Total topics in level: ${allTopicsInLevel.length}`);
		this.logger.log(`  - Completed topics by user: ${userProgress.length}`);

		// Check if ALL topics in this level are completed
		const allTopicsCompleted = allTopicsInLevel.length > 0 && 
									userProgress.length === allTopicsInLevel.length;

		this.logger.log(`  - All topics completed: ${allTopicsCompleted}`);

		if (allTopicsCompleted) {
			// Find the badge for this level
			const levelBadge = await this.prisma.badge.findFirst({
				where: {
					name: {
						startsWith: `Nível ${levelId}`,
					},
				},
			});

			if (levelBadge) {
				await this.awardBadgeToUser(userId, levelBadge.id);
				this.logger.log(`🏅 Level ${levelId} badge awarded to user ${userId}`);
			} else {
				this.logger.log(`❌ No badge found for level ${levelId}`);
			}
		} else {
			this.logger.log(`⏳ Level ${levelId} not completed yet (${userProgress.length}/${allTopicsInLevel.length} topics done)`);
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

	async checkAndAwardFinalBadge(userId: number) {
		this.logger.log(`Checking final badge for user ${userId}`);

		// Get all user's completed topics
		const userProgress = await this.prisma.progress.findMany({
			where: {
				userId,
				completed: true,
			},
			include: {
				topic: {
					include: {
						level: true,
					},
				},
			},
		});

		// Get all levels
		const allLevels = await this.prisma.level.findMany();
		const completedLevels = new Set(userProgress.map((progress) => progress.topic.levelId));

		// Check if user completed all levels
		const allLevelsCompleted = allLevels.every((level) => completedLevels.has(level.id));

		if (allLevelsCompleted) {
			// Find the final badge
			const finalBadge = await this.prisma.badge.findFirst({
				where: {
					name: {
						contains: "Full-Stack Master Internacional",
					},
				},
			});

			if (finalBadge) {
				await this.awardBadgeToUser(userId, finalBadge.id);
				this.logger.log(`Final badge awarded to user ${userId}`);
			}
		}
	}
}
