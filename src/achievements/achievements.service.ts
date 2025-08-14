import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAchievementDto } from "./dto/create-achievement.dto";
import { UpdateAchievementDto } from "./dto/update-achievement.dto";

@Injectable()
export class AchievementsService {
	private readonly logger = new Logger(AchievementsService.name)
	private readonly processingUsers = new Set<number>() // Mutex para usuários em processamento;

	constructor(private prisma: PrismaService) {}

	async create(createAchievementDto: CreateAchievementDto) {
		this.logger.log("Creating new achievement");

		return this.prisma.achievement.create({
			data: createAchievementDto,
		});
	}

	async findAll() {
		return this.prisma.achievement.findMany({
			include: {
				_count: {
					select: {
						userachievement: true,
					},
				},
			},
		});
	}

	async findOne(id: number) {
		const achievement = await this.prisma.achievement.findUnique({
			where: { id },
			include: {
				userachievement: {
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

		if (!achievement) {
			throw new NotFoundException("Conquista não encontrada");
		}

		return achievement;
	}

	async update(id: number, updateAchievementDto: UpdateAchievementDto) {
		const achievement = await this.prisma.achievement.findUnique({
			where: { id },
		});

		if (!achievement) {
			throw new NotFoundException("Conquista não encontrada");
		}

		return this.prisma.achievement.update({
			where: { id },
			data: updateAchievementDto,
		});
	}

	async remove(id: number) {
		const achievement = await this.prisma.achievement.findUnique({
			where: { id },
		});

		if (!achievement) {
			throw new NotFoundException("Conquista não encontrada");
		}

		return this.prisma.achievement.delete({
			where: { id },
		});
	}

	async checkAndAwardAchievements(userId: number) {
		this.logger.log(`🔍 Checking achievements for user ${userId}`);

		// Verificar se já está processando este usuário
		if (this.processingUsers.has(userId)) {
			this.logger.log(`⏳ User ${userId} is already being processed, skipping`);
			return [];
		}

		// Marcar usuário como em processamento
		this.processingUsers.add(userId);

		try {

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				progress: {
					include: {
						topic: true,
					},
				},
				userachievement: {
					include: {
						achievement: true,
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		const completedTopics = user.progress.filter((p) => p.completed).length;
		const totalXp = user.progress
			.filter((p) => p.completed)
			.reduce((sum, p) => sum + p.topic.xp, 0);

		this.logger.log(`📊 User stats:`);
		this.logger.log(`  - Completed topics: ${completedTopics}`);
		this.logger.log(`  - Total XP: ${totalXp}`);
		this.logger.log(`  - Current streak: ${user.currentStreak}`);

		const allAchievements = await this.prisma.achievement.findMany();
		this.logger.log(`📋 Total achievements available: ${allAchievements.length}`);

		const awardedAchievements = user.userachievement.map((ua) => ua.achievementId);
		this.logger.log(`🏆 Already awarded: ${awardedAchievements.length} achievements`);

		const newAchievements: any[] = [];

		for (const achievement of allAchievements) {
			this.logger.log(`🔍 Checking achievement: ${achievement.name}`);

			if (awardedAchievements.includes(achievement.id)) {
				this.logger.log(`  ⏭️ Already has this achievement, skipping`);
				continue; // Já conquistou
			}

			const conditions = JSON.parse(achievement.condition);
			this.logger.log(`  📋 Conditions: ${JSON.stringify(conditions)}`);
			let shouldAward = true;

			// Verificar condições
			for (const condition of conditions) {
				this.logger.log(`  🔍 Checking condition: ${condition.type} >= ${condition.value}`);
				
				switch (condition.type) {
					case "topics_completed":
						this.logger.log(`    📊 User has ${completedTopics} completed topics, needs >= ${condition.value}`);
						if (completedTopics < condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough topics completed`);
						} else {
							this.logger.log(`    ✅ Topics requirement met`);
						}
						break;
					
					case "topics_completed_exactly":
						this.logger.log(`    📊 User has ${completedTopics} completed topics, needs exactly ${condition.value}`);
						if (completedTopics !== condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Exact topics requirement not met`);
						} else {
							this.logger.log(`    ✅ Exact topics requirement met`);
						}
						break;
					
					case "level_completed":
						const levelId = condition.value;
						const levelTopics = await this.prisma.topic.findMany({
							where: { levelId },
						});
						const completedTopicsInLevel = user.progress.filter(
							(progress) => progress.completed && levelTopics.some((topic) => topic.id === progress.topicId)
						).length;
						
						this.logger.log(`    📊 Level ${levelId}: ${completedTopicsInLevel}/${levelTopics.length} topics completed`);
						
						if (completedTopicsInLevel < levelTopics.length) {
							shouldAward = false;
							this.logger.log(`    ❌ Level ${levelId} not completed`);
						} else {
							this.logger.log(`    ✅ Level ${levelId} completed`);
						}
						break;
					
					case "specific_levels_completed":
						const requiredLevels = condition.value;
						let allLevelsCompleted = true;
						
						for (const levelId of requiredLevels) {
							const levelTopics = await this.prisma.topic.findMany({
								where: { levelId },
							});
							const completedTopicsInLevel = user.progress.filter(
								(progress) => progress.completed && levelTopics.some((topic) => topic.id === progress.topicId)
							).length;
							
							if (completedTopicsInLevel < levelTopics.length) {
								allLevelsCompleted = false;
								this.logger.log(`    ❌ Level ${levelId} not completed (${completedTopicsInLevel}/${levelTopics.length})`);
								break;
							}
						}
						
						if (!allLevelsCompleted) {
							shouldAward = false;
						} else {
							this.logger.log(`    ✅ All required levels completed`);
						}
						break;
					
					case "streak_days":
						this.logger.log(`    📊 User has ${user.currentStreak} streak days, needs ${condition.value}`);
						if (user.currentStreak < condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough streak days`);
						} else {
							this.logger.log(`    ✅ Streak requirement met`);
						}
						break;
					
					case "total_xp":
						this.logger.log(`    📊 User has ${totalXp} XP, needs ${condition.value}`);
						if (totalXp < condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough XP`);
						} else {
							this.logger.log(`    ✅ XP requirement met`);
						}
						break;
					
					case "levels_completed_exactly":
						// Contar quantos níveis foram completamente concluídos
						const allLevels = await this.prisma.level.findMany({
							include: { topic: true }
						});
						
						let completedLevelsCount = 0;
						for (const level of allLevels) {
							const levelTopics = level.topic || [];
							if (levelTopics.length > 0) {
								const completedTopicsInLevel = user.progress.filter(
									(progress) => progress.completed && 
									levelTopics.some((topic) => topic.id === progress.topicId)
								).length;
								
								if (completedTopicsInLevel === levelTopics.length) {
									completedLevelsCount++;
								}
							}
						}
						
						this.logger.log(`    📊 User has ${completedLevelsCount} completed levels, needs exactly ${condition.value}`);
						if (completedLevelsCount !== condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Levels completed count doesn't match exactly`);
						} else {
							this.logger.log(`    ✅ Exact levels completed requirement met`);
						}
						break;
					
					case "levels_touched":
						// Contar em quantos níveis diferentes o usuário completou pelo menos 1 tópico
						const userTopicIds = user.progress
							.filter(p => p.completed)
							.map(p => p.topicId);
						
						const levelsWithCompletedTopics = await this.prisma.level.findMany({
							include: {
								topic: {
									where: {
										id: { in: userTopicIds }
									}
								}
							}
						});
						
						const touchedLevelsCount = levelsWithCompletedTopics.filter(
							level => level.topic.length > 0
						).length;
						
						this.logger.log(`    📊 User touched ${touchedLevelsCount} different levels, needs ${condition.value}`);
						if (touchedLevelsCount < condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough levels touched`);
						} else {
							this.logger.log(`    ✅ Levels touched requirement met`);
						}
						break;
					
					case "topics_per_day":
						// Esta verificação seria mais complexa e requereria dados de timestamp
						// Por enquanto, vamos implementar uma versão simplificada
						// que verifica se o usuário completou X tópicos hoje
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						const tomorrow = new Date(today);
						tomorrow.setDate(tomorrow.getDate() + 1);
						
						const todayCompletedTopics = user.progress.filter(progress => {
							if (!progress.completed || !progress.completedAt) return false;
							const completedDate = new Date(progress.completedAt);
							return completedDate >= today && completedDate < tomorrow;
						}).length;
						
						this.logger.log(`    📊 User completed ${todayCompletedTopics} topics today, needs ${condition.value}`);
						if (todayCompletedTopics < condition.value) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough topics completed today`);
						} else {
							this.logger.log(`    ✅ Topics per day requirement met`);
						}
						break;
					
					case "early_bird":
						// Verificar se completou um tópico antes do horário especificado
						const earlyHour = condition.value; // Hora limite (ex: 8)
						const earlyBirdProgress = user.progress.filter(progress => {
							if (!progress.completed || !progress.completedAt) return false;
							const completedDate = new Date(progress.completedAt);
							const completedHour = completedDate.getHours();
							return completedHour < earlyHour;
						});
						
						this.logger.log(`    📊 Found ${earlyBirdProgress.length} topics completed before ${earlyHour}h`);
						if (earlyBirdProgress.length === 0) {
							shouldAward = false;
							this.logger.log(`    ❌ No topics completed before ${earlyHour}h`);
						} else {
							this.logger.log(`    ✅ Early bird requirement met`);
						}
						break;
					
					case "night_owl":
						// Verificar se completou um tópico depois do horário especificado
						const nightHour = condition.value; // Hora limite (ex: 22)
						const nightOwlProgress = user.progress.filter(progress => {
							if (!progress.completed || !progress.completedAt) return false;
							const completedDate = new Date(progress.completedAt);
							const completedHour = completedDate.getHours();
							return completedHour >= nightHour;
						});
						
						this.logger.log(`    📊 Found ${nightOwlProgress.length} topics completed after ${nightHour}h`);
						if (nightOwlProgress.length === 0) {
							shouldAward = false;
							this.logger.log(`    ❌ No topics completed after ${nightHour}h`);
						} else {
							this.logger.log(`    ✅ Night owl requirement met`);
						}
						break;
					
					case "weekend_warrior":
						// Verificar se completou X tópicos no fim de semana (sábado=6, domingo=0)
						const requiredWeekendTopics = condition.value;
						const weekendProgress = user.progress.filter(progress => {
							if (!progress.completed || !progress.completedAt) return false;
							const completedDate = new Date(progress.completedAt);
							const dayOfWeek = completedDate.getDay(); // 0=domingo, 6=sábado
							return dayOfWeek === 0 || dayOfWeek === 6;
						});
						
						this.logger.log(`    📊 Found ${weekendProgress.length} topics completed on weekends, needs ${requiredWeekendTopics}`);
						if (weekendProgress.length < requiredWeekendTopics) {
							shouldAward = false;
							this.logger.log(`    ❌ Not enough weekend topics completed`);
						} else {
							this.logger.log(`    ✅ Weekend warrior requirement met`);
						}
						break;
					
					default:
						this.logger.warn(`  ⚠️ Unknown condition type: ${condition.type}`);
						shouldAward = false;
						break;
				}
			}

			this.logger.log(`  📊 Should award: ${shouldAward}`);

			if (shouldAward) {
				this.logger.log(`  🎉 Awarding achievement: ${achievement.name}`);
				
				try {
					// Usar createMany com skipDuplicates para máxima proteção
					const result = await this.prisma.$transaction(async (tx) => {
						// Primeiro verificar se já existe
						const existing = await tx.userachievement.findFirst({
							where: {
								userId,
								achievementId: achievement.id,
							},
						});

						if (existing) {
							this.logger.log(`  ⚠️ Achievement ${achievement.id} already exists for user ${userId}, skipping`);
							return null;
						}

						// Tentar criar usando createMany com skipDuplicates
						try {
							const createResult = await tx.userachievement.createMany({
								data: [{
									userId,
									achievementId: achievement.id,
								}],
								skipDuplicates: true,
							});

							if (createResult.count > 0) {
								this.logger.log(`  ✅ New achievement created for user ${userId}: ${achievement.name}`);
								
								// Buscar a conquista recém-criada
								const newAchievement = await tx.userachievement.findFirst({
									where: {
										userId,
										achievementId: achievement.id,
									},
									orderBy: {
										id: 'desc',
									},
								});
								
								// Criar notificação
								await tx.notification.create({
									data: {
										userId,
										title: "Nova Conquista!",
										message: `Você conquistou: ${achievement.name}`,
										type: "achievement",
									},
								});
								
								return newAchievement;
							} else {
								this.logger.log(`  ⚠️ Achievement ${achievement.id} skipped due to duplicate for user ${userId}`);
								return null;
							}
						} catch (error) {
							this.logger.error(`  ❌ Error creating achievement: ${error.message}`);
							return null;
						}
					});

					if (result) {
						this.logger.log(`  ✅ UserAchievement created successfully for achievement ${achievement.id}`);
						this.logger.log(`  ✅ Notification created successfully`);
						newAchievements.push(achievement);
						this.logger.log(`  ✅ Achievement awarded successfully`);
					}
				} catch (error) {
					this.logger.error(`  ❌ Error saving achievement: ${error.message}`);
					this.logger.error(`  📊 Error details:`, error);
				}
			} else {
				this.logger.log(`  ❌ Requirements not met for: ${achievement.name}`);
			}
		}

		this.logger.log(`🎯 Total new achievements awarded: ${newAchievements.length}`);
		return newAchievements;
		
		} finally {
			// Liberar o usuário do processamento
			this.processingUsers.delete(userId);
			this.logger.log(`🔓 User ${userId} released from processing`);
		}
	}

	async cleanDuplicateAchievements(userId: number) {
		this.logger.log(`🧹 Cleaning duplicate achievements for user ${userId}`);

		try {
			// Usar transação para garantir consistência
			const result = await this.prisma.$transaction(async (tx) => {
				// Buscar todas as conquistas do usuário
				const userAchievements = await tx.userachievement.findMany({
					where: { userId },
					include: { achievement: true },
					orderBy: { id: 'asc' },
				});

				this.logger.log(`📋 Found ${userAchievements.length} achievements for user ${userId}`);

				// Identificar duplicatas (mesmo achievementId, manter o primeiro)
				const seen = new Set<number>();
				const duplicates: number[] = [];

				for (const ua of userAchievements) {
					if (seen.has(ua.achievementId)) {
						duplicates.push(ua.id);
						this.logger.log(`🗑️ Duplicate found: ${ua.achievement.name} (ID: ${ua.id})`);
					} else {
						seen.add(ua.achievementId);
					}
				}

				// Remover duplicatas se existirem
				let deletedCount = { count: 0 };
				if (duplicates.length > 0) {
					deletedCount = await tx.userachievement.deleteMany({
						where: {
							id: { in: duplicates },
						},
					});

					this.logger.log(`✅ Removed ${deletedCount.count} duplicate achievements`);
				} else {
					this.logger.log(`✅ No duplicates found`);
				}

				return { removed: deletedCount.count, duplicates };
			});

			return result;
		} catch (error) {
			this.logger.error(`❌ Error cleaning duplicates for user ${userId}:`, error);
			throw error;
		}
	}

	async cleanAllDuplicates() {
		this.logger.log(`🧹 Cleaning ALL duplicate achievements in database`);

		try {
			// Usar raw SQL para ser mais eficiente
			const result = await this.prisma.$executeRaw`
				DELETE ua1 FROM userachievement ua1
				INNER JOIN userachievement ua2 
				WHERE ua1.userId = ua2.userId 
				  AND ua1.achievementId = ua2.achievementId 
				  AND ua1.id > ua2.id
			`;

			this.logger.log(`🧹 Raw SQL executed, affected rows: ${result}`);

			this.logger.log(`✅ Removed ${result} duplicate achievements from entire database`);
			return { removed: result };
		} catch (error) {
			this.logger.error(`❌ Error cleaning all duplicates:`, error);
			throw error;
		}
	}

	async getUserAchievements(userId: number) {
		return this.prisma.userachievement.findMany({
			where: { userId },
			include: {
				achievement: true,
			},
			orderBy: {
				earnedAt: "desc",
			},
		});
	}
}
