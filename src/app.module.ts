// src/app.module.ts
import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { LevelsModule } from "./levels/levels.module";
import { TopicsModule } from "./topics/topics.module";
import { ProgressModule } from "./progress/progress.module";
import { AuthModule } from "./auth/auth.module";
import { SeedModule } from "./seed/seed.module";
import { AchievementsModule } from "./achievements/achievements.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { BadgesModule } from "./badges/badges.module";
import { HealthModule } from "./health/health.module";
import { RoadmapsModule } from "./roadmaps/roadmaps.module";

import { PrismaService } from "./prisma/prisma.service";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";

@Module({
	imports: [
		CacheModule.register({
			ttl: 60000, // 1 minuto
			max: 100, // máximo 100 itens no cache
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100,
			},
		]),
		UsersModule,
		LevelsModule,
		TopicsModule,
		ProgressModule,
		AuthModule,
		SeedModule,
		AchievementsModule,
		NotificationsModule,
		BadgesModule,
		HealthModule,
		RoadmapsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		PrismaService,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
})
export class AppModule {}
