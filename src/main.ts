import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { existsSync } from "fs";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Configurar CORS
	app.enableCors({
		origin: ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:3000", "http://127.0.0.1:3000", "file://", "http://roadmap.localhost"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	});

	// Configurar versioning da API
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});

	// Configurar pasta de arquivos estáticos
	console.log("🔍 Procurando diretório public...");
	console.log("📁 Diretório atual:", process.cwd());
	console.log("📁 Conteúdo do diretório atual:", require("fs").readdirSync(process.cwd()));

	const publicDir = join(process.cwd(), "public");
	console.log("📁 Caminho do diretório public:", publicDir);

	if (!existsSync(publicDir)) {
		console.error("❌ Diretório public não encontrado!");
		process.exit(1);
	}

	console.log("📁 Conteúdo do diretório public:", require("fs").readdirSync(publicDir));

	const indexPath = join(publicDir, "index.html");
	if (!existsSync(indexPath)) {
		console.error("❌ Arquivo index.html não encontrado!");
		process.exit(1);
	}

	console.log("✅ Arquivo index.html encontrado!");

	// Configurar pasta de arquivos estáticos
	app.useStaticAssets(publicDir, {
		index: false,
		fallthrough: true,
	});

	// Middleware para servir o frontend
	app.use((req, res, next) => {
		if (req.path.startsWith("/api")) {
			next();
			return;
		}
		
		console.log("🌐 Servindo index.html para:", req.path);
		res.sendFile(indexPath);
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

	const port = process.env.PORT || 8080;
	await app.listen(port);
	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
