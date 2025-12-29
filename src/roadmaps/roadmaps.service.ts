import { Injectable, Logger, NotFoundException, ConflictException, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRoadmapDto } from "./dto/create-roadmap.dto";
import { UpdateRoadmapDto } from "./dto/update-roadmap.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class RoadmapsService {
	private readonly logger = new Logger(RoadmapsService.name);

	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async create(createRoadmapDto: CreateRoadmapDto) {
		this.logger.log(`Creating roadmap: ${createRoadmapDto.name}`);

		// Se está marcando como padrão, desmarcar outros
		if (createRoadmapDto.isDefault) {
			await this.prisma.roadmap.updateMany({
				where: { isDefault: true },
				data: { isDefault: false },
			});
		}

		// Converter descrição vazia para null
		const roadmapData = {
			...createRoadmapDto,
			description:
				createRoadmapDto.description && createRoadmapDto.description.trim()
					? createRoadmapDto.description.trim()
					: null,
		};

		const roadmap = await this.prisma.roadmap.create({
			data: roadmapData,
		});

		// Invalidar cache
		await this.cacheManager.del("roadmaps");
		await this.cacheManager.del("roadmaps:default");

		return roadmap;
	}

	async findAll() {
		const cached = await this.cacheManager.get("roadmaps");
		if (cached) {
			return cached;
		}

		const roadmaps = await this.prisma.roadmap.findMany({
			include: {
				_count: {
					select: {
						level: true,
					},
				},
			},
			orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
		});

		await this.cacheManager.set("roadmaps", roadmaps, 60000);
		return roadmaps;
	}

	async findOne(id: number) {
		const roadmap = await this.prisma.roadmap.findUnique({
			where: { id },
			include: {
				level: {
					include: {
						_count: {
							select: {
								topic: true,
							},
						},
					},
					orderBy: {
						id: "asc",
					},
				},
			},
		});

		if (!roadmap) {
			throw new NotFoundException("Roadmap não encontrado");
		}

		return roadmap;
	}

	async findDefault() {
		const cached = await this.cacheManager.get("roadmaps:default");
		if (cached) {
			return cached;
		}

		const roadmap = await this.prisma.roadmap.findFirst({
			where: { isDefault: true },
		});

		if (!roadmap) {
			// Se não há roadmap padrão, retornar o primeiro
			const firstRoadmap = await this.prisma.roadmap.findFirst({
				orderBy: { createdAt: "asc" },
			});
			return firstRoadmap;
		}

		await this.cacheManager.set("roadmaps:default", roadmap, 60000);
		return roadmap;
	}

	async update(id: number, updateRoadmapDto: UpdateRoadmapDto) {
		const roadmap = await this.prisma.roadmap.findUnique({
			where: { id },
		});

		if (!roadmap) {
			throw new NotFoundException("Roadmap não encontrado");
		}

		// Se está marcando como padrão, desmarcar outros
		if (updateRoadmapDto.isDefault) {
			await this.prisma.roadmap.updateMany({
				where: {
					isDefault: true,
					id: { not: id },
				},
				data: { isDefault: false },
			});
		}

		const updated = await this.prisma.roadmap.update({
			where: { id },
			data: updateRoadmapDto,
		});

		// Invalidar cache
		await this.cacheManager.del("roadmaps");
		await this.cacheManager.del("roadmaps:default");
		await this.cacheManager.del(`roadmap:${id}`);

		return updated;
	}

	async remove(id: number) {
		const roadmap = await this.prisma.roadmap.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						level: true,
					},
				},
			},
		});

		if (!roadmap) {
			throw new NotFoundException("Roadmap não encontrado");
		}

		if (roadmap._count.level > 0) {
			throw new ConflictException(
				"Não é possível excluir um roadmap que possui níveis. Remova os níveis primeiro.",
			);
		}

		await this.prisma.roadmap.delete({
			where: { id },
		});

		// Invalidar cache
		await this.cacheManager.del("roadmaps");
		await this.cacheManager.del("roadmaps:default");
		await this.cacheManager.del(`roadmap:${id}`);

		return { message: "Roadmap removido com sucesso" };
	}
}
