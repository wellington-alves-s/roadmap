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
	
	const possiblePublicDirs = [
		join(process.cwd(), "public"),
		join(__dirname, "..", "public"),
		join(__dirname, "..", "..", "public")
	];

	let publicDir: string | undefined;
	let indexPath: string | undefined;

	for (const dir of possiblePublicDirs) {
		console.log("📁 Verificando:", dir);
		if (existsSync(dir) && existsSync(join(dir, "index.html"))) {
			publicDir = dir;
			indexPath = join(dir, "index.html");
			console.log("✅ Diretório public encontrado em:", dir);
			console.log("📁 Conteúdo:", require("fs").readdirSync(dir));
			break;
		}
	}

	if (!publicDir || !indexPath) {
		console.error("❌ Diretório public não encontrado!");
		console.error("Diretórios verificados:", possiblePublicDirs);
		process.exit(1);
	}

	// Configurar pasta de arquivos estáticos
	app.useStaticAssets(publicDir, {
		index: false,
		prefix: "/",
	});

	// Middleware para servir o frontend
	app.use((req, res, next) => {
		const path = req.path;
		console.log("🌐 Requisição recebida:", path);

		if (path.startsWith("/api")) {
			console.log("👉 Encaminhando para API:", path);
			next();
			return;
		}

		// Verificar se é um arquivo estático
		const staticFile = join(publicDir, path);
		if (existsSync(staticFile) && !path.endsWith("/")) {
			console.log("📄 Servindo arquivo estático:", path);
			res.sendFile(staticFile);
			return;
		}

		console.log("📱 Servindo index.html para:", path);
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

	const port = process.env.PORT || 3003;
	await app.listen(port);
	console.log(`🚀 Application is running on: http://localhost:${port}`);
	console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
