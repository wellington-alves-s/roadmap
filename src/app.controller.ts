import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";
import { join } from "path";

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

	@Get("*")
	serveApp(@Res() res: Response) {
		const publicDir = join(process.cwd(), "public");
		const indexPath = join(publicDir, "index.html");
		console.log("🌐 Servindo aplicação de:", indexPath);
		return res.sendFile(indexPath);
	}
}
