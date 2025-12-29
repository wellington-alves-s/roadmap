import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { RoadmapsController } from "./roadmaps.controller";
import { RoadmapsService } from "./roadmaps.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	imports: [
		CacheModule.register({
			ttl: 60000, // 1 minuto
			max: 100, // máximo 100 itens no cache
		}),
	],
	controllers: [RoadmapsController],
	providers: [RoadmapsService, PrismaService],
	exports: [RoadmapsService],
})
export class RoadmapsModule {}
