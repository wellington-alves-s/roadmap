import { Injectable, UnauthorizedException, ConflictException, Logger, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/forgot-password.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string): Promise<any> {
		this.logger.debug(`Validating user: ${email}`);

		const user = await this.usersService.findByEmail(email);
		if (user && (await bcrypt.compare(password, user.password))) {
			const { password, ...result } = user;
			this.logger.log(`User validated successfully: ${email}`);
			return result;
		}

		this.logger.warn(`Invalid credentials for user: ${email}`);
		return null;
	}

	async login(loginDto: LoginDto) {
		this.logger.log(`Login attempt for user: ${loginDto.email}`);

		const user = await this.validateUser(loginDto.email, loginDto.password);
		if (!user) {
			this.logger.warn(`Failed login attempt for user: ${loginDto.email}`);
			throw new UnauthorizedException("Credenciais inválidas");
		}

		const payload = { email: user.email, sub: user.id };
		const token = this.jwtService.sign(payload);

		this.logger.log(`Successful login for user: ${loginDto.email}`);

		return {
			user: {
				id: user.id,
				email: user.email,
				createdAt: user.createdAt,
			},
			token,
		};
	}

	async register(registerDto: RegisterDto) {
		this.logger.log(`Registration attempt for user: ${registerDto.email}`);

		try {
			const user = await this.usersService.create(registerDto);
			const payload = { email: user.email, sub: user.id };
			const token = this.jwtService.sign(payload);

			this.logger.log(`Successful registration for user: ${registerDto.email}`);

			return {
				user: {
					id: user.id,
					email: user.email,
					createdAt: user.createdAt,
				},
				token,
			};
		} catch (error) {
			this.logger.error(`Registration failed for user: ${registerDto.email}`, error.stack);

			if (error instanceof ConflictException) {
				throw new ConflictException("Email já está em uso");
			}
			throw error;
		}
	}

	async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
		this.logger.log(`Forgot password request for: ${forgotPasswordDto.email}`);

		// Verificar se o usuário existe
		const user = await this.usersService.findByEmail(forgotPasswordDto.email);
		if (!user) {
			// Por segurança, não revelar se o email existe ou não
			this.logger.warn(`Forgot password attempt for non-existent email: ${forgotPasswordDto.email}`);
			return {
				success: true,
				message: "Se o email estiver cadastrado, você receberá instruções para resetar sua senha.",
			};
		}

		try {
			// Gerar token temporário para reset (válido por 1 hora)
			const resetToken = this.jwtService.sign(
				{ 
					email: user.email, 
					sub: user.id, 
					type: 'password-reset' 
				},
				{ expiresIn: '1h' }
			);

			this.logger.log(`Reset token generated for user: ${user.email}`);

			// Em um ambiente real, você enviaria este token por email
			// Por enquanto, vamos apenas logar e retornar sucesso
			this.logger.debug(`Reset token for ${user.email}: ${resetToken}`);

			// TODO: Implementar envio de email
			// await this.emailService.sendPasswordResetEmail(user.email, resetToken);

			return {
				success: true,
				message: "Se o email estiver cadastrado, você receberá instruções para resetar sua senha.",
				// Em desenvolvimento, retornar o token para teste
				...(process.env.NODE_ENV === 'development' && { resetToken }),
			};

		} catch (error) {
			this.logger.error(`Error generating reset token for ${forgotPasswordDto.email}:`, error);
			throw new ConflictException("Erro interno. Tente novamente mais tarde.");
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		this.logger.log("Processing password reset request");

		try {
			// Verificar e decodificar o token
			const payload = this.jwtService.verify(resetPasswordDto.token);
			
			// Verificar se é um token de reset
			if (payload.type !== 'password-reset') {
				this.logger.warn("Invalid token type for password reset");
				throw new UnauthorizedException("Token inválido");
			}

			// Buscar usuário
			const user = await this.usersService.findByEmail(payload.email);
			if (!user) {
				this.logger.warn(`Password reset attempt for non-existent user: ${payload.email}`);
				throw new NotFoundException("Usuário não encontrado");
			}

			// Hash da nova senha
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, saltRounds);

			// Atualizar senha no banco
			await this.usersService.updatePassword(user.id, hashedPassword);

			this.logger.log(`Password reset successful for user: ${user.email}`);

			return {
				success: true,
				message: "Senha alterada com sucesso. Você pode fazer login com sua nova senha.",
			};

		} catch (error) {
			if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
				this.logger.warn("Invalid or expired reset token");
				throw new UnauthorizedException("Token inválido ou expirado");
			}
			
			this.logger.error("Error resetting password:", error);
			throw error;
		}
	}

	async verifyToken(token: string) {
		try {
			const payload = this.jwtService.verify(token);
			this.logger.debug(`Token verified successfully for user: ${payload.email}`);
			return payload;
		} catch (error) {
			this.logger.warn(`Invalid token provided: ${error.message}`);
			throw new UnauthorizedException("Token inválido");
		}
	}
}
