import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { SeedService } from "../src/seed/seed.service";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const seedService = app.get(SeedService);

	try {
		await seedService.seed();
		console.log("✅ Seed executado com sucesso!");
	} catch (error) {
		console.error("❌ Erro durante o seed:", error);
	} finally {
		await app.close();
	}
}

bootstrap();
