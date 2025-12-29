import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Valida variáveis de ambiente obrigatórias
 */
function validateEnvironmentVariables() {
	const logger = new Logger("EnvironmentValidator");
	const requiredVars = ["DATABASE_URL", "JWT_SECRET"];
	const missingVars: string[] = [];

	for (const varName of requiredVars) {
		if (!process.env[varName]) {
			missingVars.push(varName);
		}
	}

	if (missingVars.length > 0) {
		logger.error("❌ Variáveis de ambiente obrigatórias não encontradas:");
		missingVars.forEach((varName) => {
			logger.error(`   - ${varName}`);
		});
		logger.error("");
		logger.error("📋 Para configurar no EasyPanel:");
		logger.error("   1. Acesse o painel do EasyPanel");
		logger.error("   2. Vá para o serviço da aplicação");
		logger.error("   3. Clique na aba 'Environment'");
		logger.error("   4. Adicione as seguintes variáveis:");
		logger.error("");
		logger.error("   DATABASE_URL=mysql://[usuario]:[senha]@[hostname]:3306/[banco]");
		logger.error("   JWT_SECRET=[sua-chave-secreta-jwt]");
		logger.error("");
		logger.error("📚 Consulte a documentação em: docs/EASYPANEL_DATABASE_CONNECTION_FIX.md");
		logger.error("");
		throw new Error(
			`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(", ")}`,
		);
	}

	logger.log("✅ Todas as variáveis de ambiente obrigatórias estão configuradas");
}

async function bootstrap() {
	// Validar variáveis de ambiente antes de iniciar
	validateEnvironmentVariables();

	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Configurar CORS
	const allowedOrigins = process.env.CORS_ORIGINS
		? process.env.CORS_ORIGINS.split(",")
		: process.env.NODE_ENV === "production"
			? true // Em produção, aceitar todas as origens (ou configure domínios específicos)
			: ["http://localhost:3003", "http://127.0.0.1:3003", "http://localhost:8080", "http://127.0.0.1:8080", "file://"];

	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	// Configurar versioning da API
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});

	// Resolver diretório "public" em dev (src) e build (dist)
	const candidatePublicDirs = [
		join(__dirname, "..", "public"), // dist/src -> dist/public | src -> public
		join(process.cwd(), "public"),
	];
	const publicDir = candidatePublicDirs.find((dir) => existsSync(join(dir, "index.html"))) || candidatePublicDirs[0];

	// Configurar pasta de arquivos estáticos
	app.useStaticAssets(publicDir, {
		index: false, // Desabilita o index automático para podermos controlar
	});

	// Configurar pasta de uploads para servir arquivos enviados
	const uploadsDir = join(process.cwd(), "uploads");
	app.useStaticAssets(uploadsDir, {
		prefix: "/uploads/",
	});

	// Middleware para servir o frontend na raiz
	app.use((req, res, next) => {
		if (req.path === "/" || req.path === "/index.html") {
			res.sendFile(join(publicDir, "index.html"));
			return;
		}
		next();
	});

	// Configurar prefixo global da API
	app.setGlobalPrefix("api");

	// Configurar validação global
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	// Configurar Swagger
	const config = new DocumentBuilder()
		.setTitle("Roadmap App API")
		.setDescription("API do sistema de gamificação de aprendizado Roadmap App")
		.setVersion("1.0")
		.addBearerAuth()
		.addTag("auth", "Autenticação")
		.addTag("users", "Usuários")
		.addTag("levels", "Níveis")
		.addTag("topics", "Tópicos")
		.addTag("progress", "Progresso")
		.addTag("achievements", "Conquistas")
		.addTag("notifications", "Notificações")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	const port = process.env.PORT || 3003;
	await app.listen(port);
	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
