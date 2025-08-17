import { Controller, Get, Param, ParseIntPipe, UseGuards, Version, Delete } from "@nestjs/common";
import { BadgesService } from "./badges.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("badges")
export class BadgesController {
	constructor(private readonly badgesService: BadgesService) {}

	@Get()
	@Version("1")
	findAll() {
		return this.badgesService.findAll();
	}

	@Get(":id")
	@Version("1")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.badgesService.findOne(id);
	}

	@Get("user/:userId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	getUserBadges(@Param("userId", ParseIntPipe) userId: number) {
		return this.badgesService.getUserBadges(userId);
	}

	@Delete("user/:userId/badge/:badgeId")
	@Version("1")
	@UseGuards(JwtAuthGuard)
	removeBadgeFromUser(
		@Param("userId", ParseIntPipe) userId: number,
		@Param("badgeId", ParseIntPipe) badgeId: number
	) {
		return this.badgesService.removeBadgeFromUser(userId, badgeId);
	}
}
