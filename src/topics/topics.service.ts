import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { XpDistributionService } from "../levels/xp-distribution.service";

@Injectable()
export class TopicsService {
	constructor(
		private prisma: PrismaService,
		private xpDistributionService: XpDistributionService,
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
		});

		if (!topic) {
			throw new NotFoundException("Tópico não encontrado");
		}

		// Salvar o levelId antes de deletar o tópico
		const levelId = topic.levelId;

		await this.prisma.topic.delete({
			where: { id },
		});

		// Se o nível tem totalXp definido, redistribuir XP automaticamente
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
		});

		if (level?.totalXp) {
			await this.xpDistributionService.recalculateXpDistribution(levelId);
		}

		return { message: "Tópico removido com sucesso" };
	}
}
