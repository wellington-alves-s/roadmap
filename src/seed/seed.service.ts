import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name);

	constructor(private prisma: PrismaService) {}

	async seed() {
		// Verificar se já existe dados
		const existingLevel = await this.prisma.level.findFirst();
		if (existingLevel) {
			this.logger.log("Dados já existem no banco. Pulando seed.");
			return;
		}

		this.logger.log("Iniciando seed do banco de dados...");

		// Criar roadmap padrão primeiro
		const defaultRoadmap = await this.createDefaultRoadmap();

		// Criar usuário de teste
		await this.createTestUser();

		// Criar todos os 21 níveis
		const levels = await this.createLevels(defaultRoadmap.id);

		// Criar tópicos para cada nível
		await this.createTopics(levels);

		// Criar conquistas
		await this.createAchievements();

		// Criar badges
		await this.createBadges();

		// Criar desafios
		await this.createChallenges();

		// Criar power-ups
		await this.createPowerUps();

		this.logger.log("Seed concluído com sucesso!");
	}

	private async createDefaultRoadmap() {
		// Verificar se já existe roadmap padrão
		let roadmap = await this.prisma.roadmap.findFirst({
			where: { isDefault: true },
		});

		if (!roadmap) {
			// Se não existe, criar um
			roadmap = await this.prisma.roadmap.create({
				data: {
					name: "Roadmap Principal",
					description: "Roadmap padrão do sistema com todos os níveis existentes",
					isDefault: true,
				},
			});
			this.logger.log("Roadmap padrão criado: " + roadmap.name);
		} else {
			this.logger.log("Roadmap padrão já existe: " + roadmap.name);
		}

		return roadmap;
	}

	private async createTestUser() {
		// Verificar se o usuário já existe
		const existingUser = await this.prisma.user.findUnique({
			where: { email: "dev@roadmap.com" },
		});

		if (!existingUser) {
			// Importar bcrypt para criptografar a senha
			const bcrypt = require("bcrypt");
			const hashedPassword = await bcrypt.hash("123456", 10);

			await this.prisma.user.create({
				data: {
					email: "dev@roadmap.com",
					password: hashedPassword,
				},
			});

			this.logger.log("Usuário de teste criado: dev@roadmap.com / 123456");
		}
	}

	private async createLevels(roadmapId: number) {
		const levelsData = [
			{ name: "Nível 1 — Fundamentos da Web e da Internet" },
			{ name: "Nível 2 — HTML com Maestria" },
			{ name: "Nível 3 — CSS do Básico ao Avançado" },
			{ name: "Nível 4 — Git, GitHub e Controle de Versão" },
			{ name: "Nível 5 — Lógica de Programação e Algoritmos" },
			{ name: "Nível 6 — JavaScript com Maestria (Vanilla JS)" },
			{ name: "Nível 7 — TypeScript do Zero à Proficiência" },
			{ name: "Nível 8 — React (ou Angular/Vue)" },
			{ name: "Nível 9 — Node.js com Express" },
			{ name: "Nível 10 — Banco de Dados" },
			{ name: "Nível 11 — NestJS com TypeScript (Back-End Avançado)" },
			{ name: "Nível 12 — APIs RESTful e RESTful Patterns" },
			{ name: "Nível 13 — Autenticação e Autorização" },
			{ name: "Nível 14 — Deploy e DevOps Básico" },
			{ name: "Nível 15 — C# com ASP.NET Core" },
			{ name: "Nível 16 — Java com Spring Boot" },
			{ name: "Nível 17 — Estrutura de Projetos, Clean Code e Testes" },
			{ name: "Nível 18 — Microserviços (Opcional Avançado)" },
			{ name: "Nível 19 — Soft Skills e Organização Profissional" },
			{ name: "Nível 20 — Inglês Técnico e Profissional" },
			{ name: "Nível 21 — Preparação para o Mercado Internacional" },
		];

		const levels: any[] = [];
		for (const levelData of levelsData) {
			const level = await this.prisma.level.create({
				data: {
					...levelData,
					roadmapId: roadmapId,
				},
			});
			levels.push(level);
		}

		return levels;
	}

	private async createTopics(levels: any[]) {
		const topicsData = [
			// Nível 1 — Fundamentos da Web e da Internet
			[
				{
					name: "O que é Internet (ISP, IP, DNS, HTTP, HTTPS, etc.)",
					xp: 30,
					levelId: levels[0].id,
				},
				{
					name: "Como funciona a Web (Cliente, Servidor, Navegador)",
					xp: 30,
					levelId: levels[0].id,
				},
				{ name: "HTTP e ciclos de requisição/resposta", xp: 25, levelId: levels[0].id },
				{ name: "Hospedagem, domínios, servidores", xp: 25, levelId: levels[0].id },
				{ name: "Web 1.0, 2.0, 3.0, WebSocket, REST", xp: 20, levelId: levels[0].id },
				{ name: "Front-end vs Back-end vs Full-stack", xp: 20, levelId: levels[0].id },
			],
			// Nível 2 — HTML com Maestria
			[
				{ name: "Estrutura HTML", xp: 25, levelId: levels[1].id },
				{ name: "Tags semânticas", xp: 25, levelId: levels[1].id },
				{
					name: "Imagens, links, listas, tabelas, formulários",
					xp: 30,
					levelId: levels[1].id,
				},
				{ name: "Acessibilidade", xp: 20, levelId: levels[1].id },
				{ name: "SEO básico", xp: 20, levelId: levels[1].id },
				{
					name: "Projetos práticos: currículo, blog, portfólio",
					xp: 30,
					levelId: levels[1].id,
				},
			],
			// Nível 3 — CSS do Básico ao Avançado
			[
				{ name: "Box model, cores, unidades, fontes", xp: 25, levelId: levels[2].id },
				{ name: "Flexbox e Grid", xp: 30, levelId: levels[2].id },
				{ name: "Position, z-index, display", xp: 25, levelId: levels[2].id },
				{ name: "Media queries e responsividade", xp: 25, levelId: levels[2].id },
				{ name: "Animações, transitions", xp: 20, levelId: levels[2].id },
				{
					name: "Bootstrap e Tailwind CSS (nível 2 opcional)",
					xp: 25,
					levelId: levels[2].id,
				},
				{ name: "Projeto prático: landing page responsiva", xp: 30, levelId: levels[2].id },
			],
			// Nível 4 — Git, GitHub e Controle de Versão
			[
				{ name: "Conceitos básicos de versionamento", xp: 20, levelId: levels[3].id },
				{ name: "Comandos Git essenciais", xp: 30, levelId: levels[3].id },
				{
					name: "Repositórios, branches, merges, pull requests",
					xp: 30,
					levelId: levels[3].id,
				},
				{ name: "GitHub, SSH, .gitignore, forks, issues", xp: 25, levelId: levels[3].id },
				{ name: "Fluxo Git colaborativo (Git Flow)", xp: 25, levelId: levels[3].id },
			],
			// Nível 5 — Lógica de Programação e Algoritmos
			[
				{ name: "Variáveis, tipos de dados", xp: 25, levelId: levels[4].id },
				{ name: "Condicionais, loops", xp: 30, levelId: levels[4].id },
				{ name: "Arrays e objetos", xp: 25, levelId: levels[4].id },
				{ name: "Funções e escopos", xp: 30, levelId: levels[4].id },
				{ name: "Estrutura de algoritmos", xp: 25, levelId: levels[4].id },
				{
					name: "Exercícios: lógica e resolução de problemas",
					xp: 35,
					levelId: levels[4].id,
				},
			],
			// Nível 6 — JavaScript com Maestria (Vanilla JS)
			[
				{ name: "Sintaxe, operadores, funções", xp: 25, levelId: levels[5].id },
				{ name: "DOM, eventos, manipulação", xp: 30, levelId: levels[5].id },
				{ name: "Arrays, objetos, métodos", xp: 30, levelId: levels[5].id },
				{ name: "Promises, Fetch API", xp: 30, levelId: levels[5].id },
				{ name: "JSON, LocalStorage, ES6+", xp: 25, levelId: levels[5].id },
				{ name: "Projeto prático: To-Do List, SPA simples", xp: 30, levelId: levels[5].id },
			],
			// Nível 7 — TypeScript do Zero à Proficiência
			[
				{ name: "Tipagem primitiva, arrays, objetos", xp: 25, levelId: levels[6].id },
				{ name: "Enums, interfaces, type aliases", xp: 30, levelId: levels[6].id },
				{ name: "Classes, generics", xp: 30, levelId: levels[6].id },
				{ name: "Tipagem em funções e async", xp: 25, levelId: levels[6].id },
				{ name: "Integração com projetos JS e React/Nest", xp: 30, levelId: levels[6].id },
			],
			// Nível 8 — React (ou Angular/Vue)
			[
				{ name: "Componentes, props, state", xp: 30, levelId: levels[7].id },
				{ name: "Eventos, renderização condicional", xp: 25, levelId: levels[7].id },
				{
					name: "Hooks (useState, useEffect, custom hooks)",
					xp: 35,
					levelId: levels[7].id,
				},
				{ name: "Context API, Router DOM", xp: 30, levelId: levels[7].id },
				{ name: "Fetch/Axios, chamadas de API", xp: 25, levelId: levels[7].id },
				{
					name: "Projeto prático: painel com CRUD e autenticação",
					xp: 35,
					levelId: levels[7].id,
				},
			],
			// Nível 9 — Node.js com Express
			[
				{ name: "Conceito de back-end e servidor web", xp: 20, levelId: levels[8].id },
				{ name: "Node.js e NPM", xp: 25, levelId: levels[8].id },
				{ name: "Express, rotas, middlewares", xp: 30, levelId: levels[8].id },
				{ name: "APIs RESTful", xp: 30, levelId: levels[8].id },
				{ name: "CRUD com arquivos JSON", xp: 25, levelId: levels[8].id },
				{ name: "Projeto prático: API de tarefas", xp: 30, levelId: levels[8].id },
			],
			// Nível 10 — Banco de Dados
			[
				{
					name: "Modelagem relacional (PostgreSQL ou MySQL)",
					xp: 30,
					levelId: levels[9].id,
				},
				{ name: "NoSQL (MongoDB básico)", xp: 25, levelId: levels[9].id },
				{ name: "CRUD com SQL e ORM (Prisma/TypeORM)", xp: 35, levelId: levels[9].id },
				{ name: "Relacionamentos e migrations", xp: 30, levelId: levels[9].id },
				{ name: "Conexão Node.js ⇆ banco", xp: 25, levelId: levels[9].id },
				{ name: "Projeto: API completa com banco real", xp: 35, levelId: levels[9].id },
			],
			// Nível 11 — NestJS com TypeScript (Back-End Avançado)
			[
				{
					name: "Módulos, controllers, services, decorators",
					xp: 30,
					levelId: levels[10].id,
				},
				{ name: "DTOs, Pipes, Guards", xp: 30, levelId: levels[10].id },
				{ name: "Validação com class-validator", xp: 25, levelId: levels[10].id },
				{ name: "Autenticação JWT", xp: 30, levelId: levels[10].id },
				{ name: "Uploads, cache, interceptors", xp: 30, levelId: levels[10].id },
				{
					name: "Projeto: API real completa (blog, ecommerce, etc.)",
					xp: 35,
					levelId: levels[10].id,
				},
			],
			// Nível 12 — APIs RESTful e RESTful Patterns
			[
				{ name: "O que é uma API RESTful", xp: 20, levelId: levels[11].id },
				{ name: "Métodos HTTP", xp: 25, levelId: levels[11].id },
				{ name: "Boas práticas de URL", xp: 25, levelId: levels[11].id },
				{ name: "Versionamento, status codes", xp: 25, levelId: levels[11].id },
				{ name: "Teste com Postman/Insomnia", xp: 25, levelId: levels[11].id },
				{ name: "Rate limiting, CORS, segurança básica", xp: 30, levelId: levels[11].id },
			],
			// Nível 13 — Autenticação e Autorização
			[
				{ name: "Hash de senhas (bcrypt)", xp: 25, levelId: levels[12].id },
				{ name: "JWT e refresh token", xp: 30, levelId: levels[12].id },
				{ name: "Middleware de proteção", xp: 25, levelId: levels[12].id },
				{ name: "RBAC: controle por função", xp: 30, levelId: levels[12].id },
				{ name: "Cookies vs localStorage", xp: 20, levelId: levels[12].id },
				{ name: "Proteção de rotas no front-end", xp: 30, levelId: levels[12].id },
			],
			// Nível 14 — Deploy e DevOps Básico
			[
				{ name: "Deploy de front-end (Vercel, Netlify)", xp: 25, levelId: levels[13].id },
				{
					name: "Deploy de back-end (Render, Railway, EC2)",
					xp: 30,
					levelId: levels[13].id,
				},
				{
					name: "Banco em nuvem (Supabase, PlanetScale, Neon)",
					xp: 25,
					levelId: levels[13].id,
				},
				{ name: "CI/CD básico com GitHub Actions", xp: 30, levelId: levels[13].id },
				{ name: "Monitoramento e logs", xp: 25, levelId: levels[13].id },
			],
			// Nível 15 — C# com ASP.NET Core
			[
				{ name: "Sintaxe C#, tipos, classes, métodos", xp: 30, levelId: levels[14].id },
				{ name: "ASP.NET Core MVC", xp: 35, levelId: levels[14].id },
				{ name: "Entity Framework", xp: 30, levelId: levels[14].id },
				{ name: "Web APIs em C#", xp: 30, levelId: levels[14].id },
				{
					name: "Projeto prático: API .NET com autenticação e banco",
					xp: 35,
					levelId: levels[14].id,
				},
			],
			// Nível 16 — Java com Spring Boot
			[
				{ name: "Sintaxe Java", xp: 30, levelId: levels[15].id },
				{
					name: "Spring Boot: controllers, services, repositories",
					xp: 35,
					levelId: levels[15].id,
				},
				{ name: "JPA e Hibernate", xp: 30, levelId: levels[15].id },
				{ name: "Beans, Injeção de Dependência", xp: 30, levelId: levels[15].id },
				{
					name: "Projeto prático: API Java com banco de dados",
					xp: 35,
					levelId: levels[15].id,
				},
			],
			// Nível 17 — Estrutura de Projetos, Clean Code e Testes
			[
				{ name: "Clean Architecture e SOLID", xp: 30, levelId: levels[16].id },
				{ name: "Separação por camadas", xp: 25, levelId: levels[16].id },
				{ name: "Testes unitários (Jest, JUnit)", xp: 30, levelId: levels[16].id },
				{ name: "Testes de integração", xp: 25, levelId: levels[16].id },
				{ name: "TDD, mocks e stubs", xp: 30, levelId: levels[16].id },
			],
			// Nível 18 — Microserviços (Opcional Avançado)
			[
				{
					name: "Diferença entre monolito e microserviços",
					xp: 25,
					levelId: levels[17].id,
				},
				{
					name: "Comunicação via HTTP e mensageria (RabbitMQ)",
					xp: 30,
					levelId: levels[17].id,
				},
				{ name: "API Gateway", xp: 25, levelId: levels[17].id },
				{ name: "Docker + containers", xp: 30, levelId: levels[17].id },
				{ name: "Deploy de microserviços", xp: 30, levelId: levels[17].id },
			],
			// Nível 19 — Soft Skills e Organização Profissional
			[
				{ name: "Kanban, Trello, Notion", xp: 20, levelId: levels[18].id },
				{ name: "Comunicação assíncrona", xp: 25, levelId: levels[18].id },
				{ name: "Scrum, sprints, backlog", xp: 30, levelId: levels[18].id },
				{ name: "Trabalho remoto produtivo", xp: 25, levelId: levels[18].id },
			],
			// Nível 20 — Inglês Técnico e Profissional
			[
				{ name: "Vocabulário de programação em inglês", xp: 25, levelId: levels[19].id },
				{
					name: "Treinamento de listening (áudios, vídeos, reuniões)",
					xp: 30,
					levelId: levels[19].id,
				},
				{ name: "Como se apresentar, falar de projetos", xp: 25, levelId: levels[19].id },
				{
					name: "Entrevistas técnicas: como responder perguntas comuns",
					xp: 30,
					levelId: levels[19].id,
				},
				{
					name: "Técnicas de speaking: improviso, pronúncia, confiança",
					xp: 30,
					levelId: levels[19].id,
				},
			],
			// Nível 21 — Preparação para o Mercado Internacional
			[
				{ name: "Criação de portfólio internacional", xp: 30, levelId: levels[20].id },
				{ name: "GitHub profissional", xp: 25, levelId: levels[20].id },
				{ name: "Como criar um currículo em inglês", xp: 25, levelId: levels[20].id },
				{
					name: "Simulação de entrevista (mock interview)",
					xp: 30,
					levelId: levels[20].id,
				},
				{
					name: "Onde encontrar vagas internacionais (LinkedIn, Turing, VanHack, etc.)",
					xp: 30,
					levelId: levels[20].id,
				},
			],
		];

		for (const levelTopics of topicsData) {
			await this.prisma.topic.createMany({
				data: levelTopics,
			});
		}
	}

	private async createAchievements() {
		await this.prisma.achievement.createMany({
			data: [
				// Conquistas de Primeiros Passos
				{
					name: "Primeiro Passo",
					description: "Complete seu primeiro tópico",
					icon: "🎯",
					condition: '[{"type": "topics_completed_exactly", "value": 1}]',
					xpReward: 50,
				},
				{
					name: "Em Movimento",
					description: "Complete 3 tópicos",
					icon: "🚶",
					condition: '[{"type": "topics_completed_exactly", "value": 3}]',
					xpReward: 75,
				},
				{
					name: "Estudioso",
					description: "Complete 5 tópicos",
					icon: "📚",
					condition: '[{"type": "topics_completed_exactly", "value": 5}]',
					xpReward: 100,
				},
				{
					name: "Persistente",
					description: "Complete 10 tópicos",
					icon: "💪",
					condition: '[{"type": "topics_completed_exactly", "value": 10}]',
					xpReward: 150,
				},
				{
					name: "Dedicado",
					description: "Complete 20 tópicos",
					icon: "⭐",
					condition: '[{"type": "topics_completed_exactly", "value": 20}]',
					xpReward: 200,
				},
				{
					name: "Mestre",
					description: "Complete 50 tópicos",
					icon: "👑",
					condition: '[{"type": "topics_completed_exactly", "value": 50}]',
					xpReward: 300,
				},

				// Conquistas de Níveis
				{
					name: "Fundamentos Concluídos",
					description: "Complete o Nível 1 - Fundamentos da Web",
					icon: "🌐",
					condition: '[{"type": "level_completed", "value": 1}]',
					xpReward: 100,
				},
				{
					name: "HTML Master",
					description: "Complete o Nível 2 - HTML com Maestria",
					icon: "📄",
					condition: '[{"type": "level_completed", "value": 2}]',
					xpReward: 100,
				},
				{
					name: "CSS Expert",
					description: "Complete o Nível 3 - CSS do Básico ao Avançado",
					icon: "🎨",
					condition: '[{"type": "level_completed", "value": 3}]',
					xpReward: 125,
				},
				{
					name: "Git Ninja",
					description: "Complete o Nível 4 - Git e GitHub",
					icon: "🐙",
					condition: '[{"type": "level_completed", "value": 4}]',
					xpReward: 100,
				},
				{
					name: "Logic Master",
					description: "Complete o Nível 5 - Lógica de Programação",
					icon: "🧠",
					condition: '[{"type": "level_completed", "value": 5}]',
					xpReward: 125,
				},
				{
					name: "JavaScript Wizard",
					description: "Complete o Nível 6 - JavaScript com Maestria",
					icon: "⚡",
					condition: '[{"type": "level_completed", "value": 6}]',
					xpReward: 125,
				},

				// Conquistas de Streak
				{
					name: "Consistente",
					description: "Mantenha um streak de 3 dias",
					icon: "🔥",
					condition: '[{"type": "streak_days", "value": 3}]',
					xpReward: 100,
				},
				{
					name: "Disciplinado",
					description: "Mantenha um streak de 7 dias",
					icon: "🎖️",
					condition: '[{"type": "streak_days", "value": 7}]',
					xpReward: 200,
				},
				{
					name: "Veterano",
					description: "Mantenha um streak de 30 dias",
					icon: "🏆",
					condition: '[{"type": "streak_days", "value": 30}]',
					xpReward: 500,
				},

				// Conquistas de XP
				{
					name: "Colecionador",
					description: "Acumule 500 XP",
					icon: "💰",
					condition: '[{"type": "total_xp", "value": 500}]',
					xpReward: 100,
				},
				{
					name: "XP Master",
					description: "Acumule 1000 XP",
					icon: "💎",
					condition: '[{"type": "total_xp", "value": 1000}]',
					xpReward: 200,
				},
				{
					name: "XP Legend",
					description: "Acumule 2500 XP",
					icon: "👑",
					condition: '[{"type": "total_xp", "value": 2500}]',
					xpReward: 500,
				},

				// Conquistas de Marcos de Tópicos
				{
					name: "Centena",
					description: "Complete 100 tópicos",
					icon: "💯",
					condition: '[{"type": "topics_completed_exactly", "value": 100}]',
					xpReward: 500,
				},
				{
					name: "Maratonista",
					description: "Complete 150 tópicos",
					icon: "🏃‍♂️",
					condition: '[{"type": "topics_completed_exactly", "value": 150}]',
					xpReward: 750,
				},
				{
					name: "Lenda",
					description: "Complete todos os tópicos disponíveis",
					icon: "🌟",
					condition: '[{"type": "topics_completed_exactly", "value": 200}]',
					xpReward: 1500,
				},

				// Conquistas de Níveis Avançados
				{
					name: "Backend Master",
					description: "Complete o Nível 7 - Node.js Fundamentals",
					icon: "⚙️",
					condition: '[{"type": "level_completed", "value": 7}]',
					xpReward: 150,
				},
				{
					name: "Database Guru",
					description: "Complete o Nível 8 - Bancos de Dados",
					icon: "🗄️",
					condition: '[{"type": "level_completed", "value": 8}]',
					xpReward: 150,
				},
				{
					name: "API Architect",
					description: "Complete o Nível 9 - APIs e Integração",
					icon: "🔗",
					condition: '[{"type": "level_completed", "value": 9}]',
					xpReward: 175,
				},
				{
					name: "Framework Ninja",
					description: "Complete o Nível 10 - Frameworks Modernos",
					icon: "🥷",
					condition: '[{"type": "level_completed", "value": 10}]',
					xpReward: 175,
				},
				{
					name: "DevOps Explorer",
					description: "Complete o Nível 11 - DevOps e Deploy",
					icon: "🚀",
					condition: '[{"type": "level_completed", "value": 11}]',
					xpReward: 200,
				},

				// Conquistas de XP Avançadas
				{
					name: "XP Titan",
					description: "Acumule 5000 XP",
					icon: "⚡",
					condition: '[{"type": "total_xp", "value": 5000}]',
					xpReward: 750,
				},
				{
					name: "XP God",
					description: "Acumule 10000 XP",
					icon: "🌟",
					condition: '[{"type": "total_xp", "value": 10000}]',
					xpReward: 1000,
				},

				// Conquistas de Streak Avançadas
				{
					name: "Inabalável",
					description: "Mantenha um streak de 15 dias",
					icon: "💪",
					condition: '[{"type": "streak_days", "value": 15}]',
					xpReward: 300,
				},
				{
					name: "Imparável",
					description: "Mantenha um streak de 60 dias",
					icon: "🔥",
					condition: '[{"type": "streak_days", "value": 60}]',
					xpReward: 750,
				},
				{
					name: "Lendário",
					description: "Mantenha um streak de 100 dias",
					icon: "👑",
					condition: '[{"type": "streak_days", "value": 100}]',
					xpReward: 1500,
				},

				// Conquistas de Velocidade
				{
					name: "Velocista",
					description: "Complete 5 tópicos em um único dia",
					icon: "💨",
					condition: '[{"type": "topics_per_day", "value": 5}]',
					xpReward: 150,
				},
				{
					name: "Relâmpago",
					description: "Complete 10 tópicos em um único dia",
					icon: "⚡",
					condition: '[{"type": "topics_per_day", "value": 10}]',
					xpReward: 300,
				},
				{
					name: "Supersônico",
					description: "Complete 15 tópicos em um único dia",
					icon: "🚀",
					condition: '[{"type": "topics_per_day", "value": 15}]',
					xpReward: 500,
				},

				// Conquistas de Exploração
				{
					name: "Explorador",
					description: "Complete pelo menos 1 tópico em 5 níveis diferentes",
					icon: "🗺️",
					condition: '[{"type": "levels_touched", "value": 5}]',
					xpReward: 200,
				},
				{
					name: "Aventureiro",
					description: "Complete pelo menos 1 tópico em 10 níveis diferentes",
					icon: "🎒",
					condition: '[{"type": "levels_touched", "value": 10}]',
					xpReward: 350,
				},
				{
					name: "Desbravador",
					description: "Complete pelo menos 1 tópico em todos os 21 níveis",
					icon: "🧭",
					condition: '[{"type": "levels_touched", "value": 21}]',
					xpReward: 750,
				},

				// Conquistas Especiais
				{
					name: "Frontend Developer",
					description: "Complete os níveis básicos de Frontend (1-3, 6)",
					icon: "🎨",
					condition: '[{"type": "specific_levels_completed", "value": [1, 2, 3, 6]}]',
					xpReward: 400,
				},
				{
					name: "Backend Developer",
					description: "Complete os níveis de Backend (4, 5, 7, 8, 9)",
					icon: "⚙️",
					condition: '[{"type": "specific_levels_completed", "value": [4, 5, 7, 8, 9]}]',
					xpReward: 600,
				},
				{
					name: "Full Stack Developer",
					description: "Complete todos os níveis principais (1-12)",
					icon: "🚀",
					condition: '[{"type": "specific_levels_completed", "value": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}]',
					xpReward: 1000,
				},
				{
					name: "Internacional",
					description: "Complete os níveis de soft skills e inglês",
					icon: "🌍",
					condition: '[{"type": "specific_levels_completed", "value": [19, 20, 21]}]',
					xpReward: 500,
				},

				// Conquistas de Primeiro Contato
				{
					name: "Primeiro Nível",
					description: "Complete seu primeiro nível completo",
					icon: "🥇",
					condition: '[{"type": "levels_completed_exactly", "value": 1}]',
					xpReward: 150,
				},
				{
					name: "Trio de Ouro",
					description: "Complete 3 níveis completos",
					icon: "🥉",
					condition: '[{"type": "levels_completed_exactly", "value": 3}]',
					xpReward: 300,
				},
				{
					name: "Meia Dúzia",
					description: "Complete 6 níveis completos",
					icon: "🎯",
					condition: '[{"type": "levels_completed_exactly", "value": 6}]',
					xpReward: 500,
				},
				{
					name: "Dezena Dourada",
					description: "Complete 10 níveis completos",
					icon: "🏆",
					condition: '[{"type": "levels_completed_exactly", "value": 10}]',
					xpReward: 750,
				},
				{
					name: "Completista",
					description: "Complete todos os 21 níveis",
					icon: "👑",
					condition: '[{"type": "levels_completed_exactly", "value": 21}]',
					xpReward: 2000,
				},

				// Conquistas de Tempo
				{
					name: "Madrugador",
					description: "Complete um tópico antes das 8h",
					icon: "🌅",
					condition: '[{"type": "early_bird", "value": 8}]',
					xpReward: 100,
				},
				{
					name: "Coruja",
					description: "Complete um tópico depois das 22h",
					icon: "🦉",
					condition: '[{"type": "night_owl", "value": 22}]',
					xpReward: 100,
				},
				{
					name: "Fim de Semana",
					description: "Complete 5 tópicos no fim de semana",
					icon: "🏖️",
					condition: '[{"type": "weekend_warrior", "value": 5}]',
					xpReward: 200,
				},
			],
		});
	}

	private async createBadges() {
		await this.prisma.badge.createMany({
			data: [
				// Badges por nível
				{
					name: "Nível 1 — Fundamentos da Web e da Internet",
					description:
						"Conquistou o conhecimento fundamental de como a internet funciona por trás dos navegadores.",
					icon: "🌐",
					category: "level",
				},
				{
					name: "Nível 2 — HTML com Maestria",
					description:
						"Dominou a construção estrutural de páginas com HTML semântico, limpo e acessível.",
					icon: "🧱",
					category: "level",
				},
				{
					name: "Nível 3 — CSS do Básico ao Avançado",
					description:
						"Domina completamente a estilização de páginas com CSS, incluindo responsividade e layout moderno.",
					icon: "🎨",
					category: "level",
				},
				{
					name: "Nível 4 — Git e GitHub",
					description:
						"Controla o histórico do seu código como um ninja do Git e colabora em alto nível com GitHub.",
					icon: "🧬",
					category: "level",
				},
				{
					name: "Nível 5 — Lógica e Algoritmos",
					description:
						"Pensamento lógico afiado, domina a construção de algoritmos e resolução de problemas.",
					icon: "🧠",
					category: "level",
				},
				{
					name: "Nível 6 — JavaScript com Maestria",
					description:
						"Domina a linguagem da web com fluidez em lógica, DOM, ES6+ e integração com a web moderna.",
					icon: "🪄",
					category: "level",
				},
				{
					name: "Nível 7 — TypeScript Profissional",
					description:
						"Domina TypeScript, trazendo segurança e robustez para projetos modernos com JS.",
					icon: "🛡️",
					category: "level",
				},
				{
					name: "Nível 8 — React",
					description:
						"Cria aplicações modernas e reativas com componentes, hooks e roteamento.",
					icon: "⚛️",
					category: "level",
				},
				{
					name: "Nível 9 — Node.js com Express",
					description:
						"Domina o backend com Node.js, rotas, middlewares e construção de APIs robustas.",
					icon: "🔥",
					category: "level",
				},
				{
					name: "Nível 10 — Banco de Dados",
					description:
						"Sabe modelar, manipular e consultar dados em bancos relacionais e NoSQL.",
					icon: "🗄️",
					category: "level",
				},
				{
					name: "Nível 11 — NestJS",
					description:
						"Cria APIs escaláveis com injeção de dependência, validações e arquitetura robusta.",
					icon: "🧩",
					category: "level",
				},
				{
					name: "Nível 12 — APIs RESTful",
					description:
						"Domina a criação e consumo de APIs REST com padrões profissionais e segurança.",
					icon: "📨",
					category: "level",
				},
				{
					name: "Nível 13 — Autenticação e Autorização",
					description: "Sabe proteger sistemas com JWT, roles e autenticação sólida.",
					icon: "🔐",
					category: "level",
				},
				{
					name: "Nível 14 — Deploy e DevOps Básico",
					description:
						"Consegue colocar seus projetos no ar com CI/CD, hospedagem e bancos na nuvem.",
					icon: "🚀",
					category: "level",
				},
				{
					name: "Nível 15 — C# com ASP.NET Core",
					description:
						"Domina a criação de APIs modernas com ASP.NET, orientação a objetos e boas práticas.",
					icon: "🛡️⚔️",
					category: "level",
				},
				{
					name: "Nível 16 — Java com Spring Boot",
					description:
						"Cria sistemas sólidos com Spring Boot, injeção de dependência e JPA.",
					icon: "🥷☕",
					category: "level",
				},
				{
					name: "Nível 17 — Clean Code e Testes",
					description:
						"Escreve código limpo, modular e testável seguindo padrões profissionais.",
					icon: "🧼🧪",
					category: "level",
				},
				{
					name: "Nível 18 — Microserviços",
					description:
						"Sabe quebrar sistemas em serviços independentes com Docker, mensageria e APIs.",
					icon: "🎻",
					category: "level",
				},
				{
					name: "Nível 19 — Soft Skills e Produtividade",
					description:
						"Gerencia tarefas com eficiência, colabora bem em times e se comunica com clareza.",
					icon: "🧭",
					category: "level",
				},
				{
					name: "Nível 20 — Inglês Técnico e Profissional",
					description:
						"Apresenta projetos, participa de reuniões e entrevistas em inglês com confiança.",
					icon: "🗣️🌍",
					category: "level",
				},
				{
					name: "Nível 21 — Preparação para o Mercado Internacional",
					description:
						"Está pronto para atuar em empresas no exterior, com currículo, portfólio e GitHub profissional.",
					icon: "🧳💼",
					category: "level",
				},
				// Badge final
				{
					name: "Full-Stack Master Internacional",
					description:
						"Concluiu o roadmap completo, preparado para qualquer desafio técnico ou cultural.",
					icon: "🧠👨‍💻🌍",
					category: "final",
				},
			],
		});
	}

	private async createChallenges() {
		const now = new Date();
		const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		await this.prisma.challenge.createMany({
			data: [
				{
					title: "Desafio Diário",
					description: "Complete 2 tópicos hoje",
					type: "daily",
					xpReward: 100,
					startDate: now,
					endDate: tomorrow,
					conditions: '[{"type": "topics_completed", "value": 2}]',
				},
				{
					title: "Desafio Semanal",
					description: "Complete 10 tópicos esta semana",
					type: "weekly",
					xpReward: 300,
					startDate: now,
					endDate: nextWeek,
					conditions: '[{"type": "topics_completed", "value": 10}]',
				},
				{
					title: "Desafio Frontend",
					description: "Complete todos os tópicos de HTML, CSS e JavaScript",
					type: "special",
					xpReward: 500,
					startDate: now,
					endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 dias
					conditions: '[{"type": "levels_completed", "value": [1, 2, 3, 6]}]',
				},
				{
					title: "Desafio Backend",
					description: "Complete todos os tópicos de Node.js, banco de dados e APIs",
					type: "special",
					xpReward: 500,
					startDate: now,
					endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 dias
					conditions: '[{"type": "levels_completed", "value": [9, 10, 11, 12]}]',
				},
			],
		});
	}

	private async createPowerUps() {
		await this.prisma.powerup.createMany({
			data: [
				{
					name: "XP Duplo",
					description: "Ganhe o dobro de XP por 30 minutos",
					effect: "double_xp",
					duration: 30,
					cost: 100,
				},
				{
					name: "Pular Nível",
					description: "Pule um nível diretamente",
					effect: "skip_level",
					duration: 0,
					cost: 500,
				},
				{
					name: "Dica",
					description: "Receba uma dica para o tópico atual",
					effect: "hint",
					duration: 0,
					cost: 50,
				},
			],
		});
	}

	async resetAndSeed() {
		this.logger.log("Resetando banco de dados...");

		// Deletar todos os dados em ordem (respeitando foreign keys)
		await this.prisma.userachievement.deleteMany();
		await this.prisma.userbadge.deleteMany();
		await this.prisma.userchallenge.deleteMany();
		await this.prisma.leaderboardentry.deleteMany();
		await this.prisma.notification.deleteMany();
		await this.prisma.mentorship.deleteMany();
		await this.prisma.analytics.deleteMany();
		await this.prisma.usercurrency.deleteMany();
		await this.prisma.progress.deleteMany();
		await this.prisma.topic.deleteMany();
		await this.prisma.level.deleteMany();
		await this.prisma.user.deleteMany();
		await this.prisma.achievement.deleteMany();
		await this.prisma.badge.deleteMany();
		await this.prisma.challenge.deleteMany();
		await this.prisma.leaderboard.deleteMany();
		await this.prisma.mentor.deleteMany();
		await this.prisma.powerup.deleteMany();

		this.logger.log("Banco resetado. Executando seed...");
		await this.seed();
	}
}
