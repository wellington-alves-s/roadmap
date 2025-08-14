import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get("status")
	getStatus() {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			service: "roadmap-app",
			environment: process.env.NODE_ENV || "development"
		};
	}
}
