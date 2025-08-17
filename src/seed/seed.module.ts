import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
	providers: [SeedService, PrismaService],
	controllers: [SeedController],
})
export class SeedModule {}
