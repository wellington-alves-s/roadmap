import { Module } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";
import { PrismaService } from "../prisma/prisma.service";
import { LevelsModule } from "../levels/levels.module";
import { BadgesModule } from "../badges/badges.module";
import { AchievementsModule } from "../achievements/achievements.module";

@Module({
	imports: [LevelsModule, BadgesModule, AchievementsModule],
	providers: [ProgressService, PrismaService],
	controllers: [ProgressController],
	exports: [ProgressService],
})
export class ProgressModule {}
