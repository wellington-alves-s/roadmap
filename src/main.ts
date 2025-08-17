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
		origin: ["http://localhost:8080", "http://127.0.0.1:8080", "file://"],
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

	const port = process.env.PORT || 8080;
	await app.listen(port);
	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
