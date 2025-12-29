import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Erro interno do servidor";

		// Log do erro
		this.logger.error(
			`Exception occurred: ${exception instanceof Error ? exception.message : "Unknown error"}`,
			exception instanceof Error ? exception.stack : undefined,
		);

		// Tratamento específico para diferentes tipos de erro
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();
			message =
				typeof exceptionResponse === "string"
					? exceptionResponse
					: (exceptionResponse as any).message || exception.message;
		} else if (exception instanceof PrismaClientKnownRequestError) {
			this.logger.error(`Prisma Error Code: ${exception.code}`);
			this.logger.error(`Prisma Error Message: ${exception.message}`);
			this.logger.error(`Prisma Meta: ${JSON.stringify(exception.meta)}`);
			
			switch (exception.code) {
				case "P2002":
					status = HttpStatus.CONFLICT;
					message = "Registro duplicado";
					break;
				case "P2025":
					status = HttpStatus.NOT_FOUND;
					message = "Registro não encontrado";
					break;
				case "P2003":
					status = HttpStatus.BAD_REQUEST;
					message = "Violação de chave estrangeira";
					break;
				case "P2010":
					status = HttpStatus.BAD_REQUEST;
					message = `Erro de validação: ${exception.message}`;
					break;
				default:
					status = HttpStatus.BAD_REQUEST;
					message = `Erro de validação no banco de dados: ${exception.message || exception.code}`;
			}
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		// Resposta padronizada
		const errorResponse = {
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message,
			...(process.env.NODE_ENV === "development" && {
				stack: exception instanceof Error ? exception.stack : undefined,
			}),
		};

		response.status(status).json(errorResponse);
	}
}
