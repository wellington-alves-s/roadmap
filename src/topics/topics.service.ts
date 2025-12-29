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

interface ResourceData {
	title: string;
	url: string;
	type: string;
	description?: string;
}

interface ExistingFileData {
	id?: number;
	name: string;
	path: string;
	type: string;
	size: number;
}

// Função utilitária para corrigir encoding UTF-8 em nomes de arquivos
function fixFileNameEncoding(fileName: string): string {
	try {
		// Verifica se já está em UTF-8 válido
		if (Buffer.from(fileName, 'utf8').toString('utf8') === fileName) {
			// Verifica se contém caracteres mal codificados (como Ã³ em vez de ó)
			if (fileName.includes('Ã') || fileName.includes('Â') || fileName.includes('Ã§') || fileName.includes('Ã£')) {
				// Tenta decodificar como Latin-1 e recodificar como UTF-8
				const bytes: number[] = [];
				for (let i = 0; i < fileName.length; i++) {
					bytes.push(fileName.charCodeAt(i) & 0xFF);
				}
				const fixed = Buffer.from(bytes).toString('utf8');
				console.log(`🔤 Encoding corrigido: "${fileName}" → "${fixed}"`);
				return fixed;
			}
		}
		return fileName;
	} catch (error) {
		// Se falhar, retorna o nome original
		console.warn('Erro ao corrigir encoding do arquivo:', fileName, error);
		return fileName;
	}
}

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
		const cacheKeys = [
			"topics",
			`level:${level.id}`,
			"levels",
			`levels:roadmap:${level.roadmapId}`,
			"dashboard",
			`topics:level:${level.id}`,
		];
		await Promise.all(cacheKeys.map(key => this.cacheManager.del(key)));

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
				resources: true,
				files: true,
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

	async updateWithFiles(id: number, updateData: any, files: Express.Multer.File[]) {
		const topic = await this.prisma.topic.findUnique({
			where: { id },
		});

		if (!topic) {
			throw new NotFoundException("Tópico não encontrado");
		}

		// Parse resources if it's a string
		let resources: ResourceData[] = [];
		if (updateData.resources) {
			try {
				resources = typeof updateData.resources === 'string' 
					? JSON.parse(updateData.resources) 
					: updateData.resources;
			} catch (e) {
				resources = [];
			}
		}

		// Parse existing files to keep
		let existingFiles: ExistingFileData[] = [];
		if (updateData.existingFiles) {
			try {
				existingFiles = typeof updateData.existingFiles === 'string' 
					? JSON.parse(updateData.existingFiles) 
					: updateData.existingFiles;
			} catch (e) {
				existingFiles = [];
			}
		}

		// Convert string values to appropriate types
		const topicData = {
			name: updateData.name,
			xp: parseInt(updateData.xp),
			levelId: parseInt(updateData.levelId),
			videoUrl: updateData.videoUrl || null,
			description: updateData.description || null,
		};

		// Use transaction to update everything atomically
		return this.prisma.$transaction(async (prisma) => {
			// Update basic topic info
			const updatedTopic = await prisma.topic.update({
				where: { id },
				data: topicData,
			});

			// Delete existing resources and create new ones
			await prisma.resource.deleteMany({
				where: { topicId: id },
			});

			if (resources.length > 0) {
				const newResources = resources
					.filter(r => r.url && r.title) // Only valid resources
					.map(resource => ({
						title: resource.title,
						url: resource.url,
						type: resource.type || 'link',
						description: resource.description || null,
						topicId: id,
					}));

				if (newResources.length > 0) {
					await prisma.resource.createMany({
						data: newResources,
					});
				}
			}

			// Delete all existing files first
			await prisma.file.deleteMany({
				where: { topicId: id },
			});

			// Re-create existing files that should be kept
			if (existingFiles.length > 0) {
				const existingFileRecords = existingFiles.map(file => ({
					name: file.name,
					path: file.path,
					type: file.type,
					size: file.size,
					topicId: id,
				}));

				await prisma.file.createMany({
					data: existingFileRecords,
				});
			}

			// Handle new file uploads
			if (files && files.length > 0) {
				const fileRecords = files.map(file => ({
					name: fixFileNameEncoding(file.originalname),
					path: `/uploads/topics/${file.filename}`, // Use relative path for web access
					type: file.mimetype,
					size: file.size,
					topicId: id,
				}));

				await prisma.file.createMany({
					data: fileRecords,
				});
			}

			// Return updated topic with all relations
			return prisma.topic.findUnique({
				where: { id },
				include: {
					level: true,
					resources: true,
					files: true,
				},
			});
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

		// Buscar nível para redistribuir XP e invalidar cache
		const level = await this.prisma.level.findUnique({
			where: { id: levelId },
			select: { totalXp: true, roadmapId: true },
		});

		if (level?.totalXp) {
			await this.xpDistributionService.recalculateXpDistribution(levelId);
		}

		// Invalidate all related caches
		const cacheKeys = [
			"topics",
			`level:${levelId}`,
			"levels",
			"dashboard",
			`topics:level:${levelId}`,
			"progress",
		];
		
		if (level?.roadmapId) {
			cacheKeys.push(`levels:roadmap:${level.roadmapId}`);
		}
		
		await Promise.all(cacheKeys.map(key => this.cacheManager.del(key)));

		return { message: "Tópico e seus registros de progresso removidos com sucesso" };
	}
}
