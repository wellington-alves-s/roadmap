import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class FrontendController {
	@Get()
	serveFrontend(@Res() res: Response) {
		res.sendFile("C:\\Users\\Ton\\Downloads\\roadmap\\roadmap-app\\public\\index.html");
	}

	@Get("styles.css")
	serveStyles(@Res() res: Response) {
		res.sendFile("C:\\Users\\Ton\\Downloads\\roadmap\\roadmap-app\\public\\styles.css");
	}

	@Get("app.js")
	serveAppJs(@Res() res: Response) {
		res.sendFile("C:\\Users\\Ton\\Downloads\\roadmap\\roadmap-app\\public\\app.js");
	}
}
