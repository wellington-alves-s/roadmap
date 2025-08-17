import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Version } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@Version("1")
	@HttpCode(HttpStatus.OK)
	@UseGuards(ThrottlerGuard)
	@ApiOperation({ summary: "Fazer login no sistema" })
	@ApiBody({ type: LoginDto })
	@ApiResponse({
		status: 200,
		description: "Login realizado com sucesso",
		schema: {
			type: "object",
			properties: {
				user: {
					type: "object",
					properties: {
						id: { type: "number" },
						email: { type: "string" },
						createdAt: { type: "string", format: "date-time" },
					},
				},
				token: { type: "string" },
			},
		},
	})
	@ApiResponse({ status: 401, description: "Credenciais inválidas" })
	@ApiResponse({ status: 429, description: "Muitas tentativas de login" })
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post("register")
	@Version("1")
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(ThrottlerGuard)
	@ApiOperation({ summary: "Registrar novo usuário" })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({
		status: 201,
		description: "Usuário registrado com sucesso",
		schema: {
			type: "object",
			properties: {
				user: {
					type: "object",
					properties: {
						id: { type: "number" },
						email: { type: "string" },
						createdAt: { type: "string", format: "date-time" },
					},
				},
				token: { type: "string" },
			},
		},
	})
	@ApiResponse({ status: 409, description: "Email já está em uso" })
	@ApiResponse({ status: 429, description: "Muitas tentativas de registro" })
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}
}
