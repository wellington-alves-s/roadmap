import { Module } from "@nestjs/common";
import { BadgesService } from "./badges.service";
import { BadgesController } from "./badges.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	controllers: [BadgesController],
	providers: [BadgesService, PrismaService],
	exports: [BadgesService],
})
export class BadgesModule {}
