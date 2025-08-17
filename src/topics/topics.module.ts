import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";
import { XpDistributionService } from "../levels/xp-distribution.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	imports: [CacheModule.register()],
	providers: [TopicsService, XpDistributionService, PrismaService],
	controllers: [TopicsController],
	exports: [TopicsService],
})
export class TopicsModule {}
