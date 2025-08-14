import { Module } from "@nestjs/common";
import { TopicsService } from "./topics.service";
import { TopicsController } from "./topics.controller";
import { XpDistributionService } from "../levels/xp-distribution.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	providers: [TopicsService, XpDistributionService, PrismaService],
	controllers: [TopicsController],
	exports: [TopicsService],
})
export class TopicsModule {}
