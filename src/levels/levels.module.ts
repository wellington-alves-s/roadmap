import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { LevelsService } from "./levels.service";
import { LevelsController } from "./levels.controller";
import { XpDistributionService } from "./xp-distribution.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	imports: [
		CacheModule.register({
			ttl: 60000, // 1 minute
			max: 100, // maximum number of items in cache
		}),
	],
	providers: [LevelsService, XpDistributionService, PrismaService],
	controllers: [LevelsController],
	exports: [LevelsService, XpDistributionService],
})
export class LevelsModule {}
