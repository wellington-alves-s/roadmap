import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";

@Controller()
export class FrontendController {
	@Get()
	serveFrontend(@Res() res: Response) {
		res.sendFile(join(process.cwd(), "public", "index.html"));
	}

	@Get("styles.css")
	serveStyles(@Res() res: Response) {
		res.sendFile(join(process.cwd(), "public", "styles.css"));
	}

	@Get("app.js")
	serveAppJs(@Res() res: Response) {
		res.sendFile(join(process.cwd(), "public", "app.js"));
	}

	// Capturar tentativas de acesso incorretas para evitar logs de erro
	@Get("3003")
	handleIncorrectPort(@Res() res: Response) {
		// Redirecionar para a página principal
		res.redirect("/");
	}

	@Get("favicon.ico")
	handleFaviconIco(@Res() res: Response) {
		res.sendFile(join(process.cwd(), "public", "favicon.ico"));
	}

	@Get("favicon.svg")
	handleFaviconSvg(@Res() res: Response) {
		res.sendFile(join(process.cwd(), "public", "favicon.svg"));
	}
}
