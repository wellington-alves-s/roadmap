import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class XpDistributionService {
	private readonly logger = new Logger(XpDistributionService.name);

	constructor(private prisma: PrismaService) {}

	/**
	 * Distribui o XP total do nível igualmente entre os tópicos
	 */
	async distributeXpToTopics(levelId: number, totalXp: number) {
		this.logger.log(`Distribuindo ${totalXp} XP para os tópicos do nível ${levelId}`);

		// Buscar todos os tópicos do nível
		const topics = await this.prisma.topic.findMany({
			where: { levelId },
		});

		if (topics.length === 0) {
			this.logger.warn(`Nenhum tópico encontrado para o nível ${levelId}`);
			return;
		}

		// Calcular XP por tópico (divisão igual)
		const xpPerTopic = Math.floor(totalXp / topics.length);
		const remainder = totalXp % topics.length; // XP restante

		this.logger.log(`Distribuindo ${xpPerTopic} XP por tópico (${topics.length} tópicos)`);

		// Atualizar cada tópico
		for (let i = 0; i < topics.length; i++) {
			let xpToAssign = xpPerTopic;

			// Distribuir o resto do XP nos primeiros tópicos
			if (i < remainder) {
				xpToAssign += 1;
			}

			await this.prisma.topic.update({
				where: { id: topics[i].id },
				data: { xp: xpToAssign },
			});

			this.logger.debug(`Tópico ${topics[i].id} atualizado com ${xpToAssign} XP`);
		}

		this.logger.log(`XP distribuído com sucesso para ${topics.length} tópicos`);
	}

	/**
	 * Recalcula a distribuição de XP quando tópicos são adicionados/removidos
	 */
	async recalculateXpDistribution(levelId: number) {
		this.logger.log(`Recalculando distribuição de XP para o nível ${levelId}`);

		// Buscar o nível com totalXp
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
		});

		if (!level || !level.totalXp) {
			this.logger.warn(`Nível ${levelId} não tem totalXp definido`);
			return;
		}

		await this.distributeXpToTopics(levelId, level.totalXp);
	}

	/**
	 * Verifica se um nível tem XP total definido
	 */
	async hasTotalXp(levelId: number): Promise<boolean> {
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
			select: { totalXp: true },
		});

		return level?.totalXp !== null && level?.totalXp !== undefined;
	}

	/**
	 * Obtém o XP total de um nível
	 */
	async getTotalXp(levelId: number): Promise<number | null> {
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
			select: { totalXp: true },
		});

		return level?.totalXp || null;
	}
}
