import { Injectable, UnauthorizedException, ConflictException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
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
