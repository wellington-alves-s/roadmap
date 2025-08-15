import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
	@Get()
	getHealth() {
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			service: "roadmap-app",
			environment: process.env.NODE_ENV || "development",
			port: process.env.PORT || "8080"
		};
	}

	@Get("check")
	getHealthCheck() {
		return {
			status: "healthy",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memory: process.memoryUsage(),
			version: "1.0.0"
		};
	}
}
