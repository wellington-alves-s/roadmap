import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException, ConflictException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

describe("AuthService", () => {
	let service: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	const mockUsersService = {
		findByEmail: jest.fn(),
		create: jest.fn(),
	};

	const mockJwtService = {
		sign: jest.fn(),
		verify: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
		jwtService = module.get<JwtService>(JwtService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("validateUser", () => {
		it("should return user without password when credentials are valid", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: await bcrypt.hash("password123", 10),
			};

			mockUsersService.findByEmail.mockResolvedValue(mockUser);

			const result = await service.validateUser("test@example.com", "password123");

			expect(result).toEqual({
				id: 1,
				email: "test@example.com",
			});
			expect(mockUsersService.findByEmail).toHaveBeenCalledWith("test@example.com");
		});

		it("should return null when user is not found", async () => {
			mockUsersService.findByEmail.mockResolvedValue(null);

			const result = await service.validateUser("test@example.com", "password123");

			expect(result).toBeNull();
		});

		it("should return null when password is invalid", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: await bcrypt.hash("password123", 10),
			};

			mockUsersService.findByEmail.mockResolvedValue(mockUser);

			const result = await service.validateUser("test@example.com", "wrongpassword");

			expect(result).toBeNull();
		});
	});

	describe("login", () => {
		it("should return user and token when credentials are valid", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: await bcrypt.hash("password123", 10),
			};

			mockUsersService.findByEmail.mockResolvedValue(mockUser);
			mockJwtService.sign.mockReturnValue("mock-jwt-token");

			const result = await service.login({
				email: "test@example.com",
				password: "password123",
			});

			expect(result).toEqual({
				user: {
					id: 1,
					email: "test@example.com",
					createdAt: mockUser.createdAt,
				},
				token: "mock-jwt-token",
			});
		});

		it("should throw UnauthorizedException when credentials are invalid", async () => {
			mockUsersService.findByEmail.mockResolvedValue(null);

			await expect(
				service.login({
					email: "test@example.com",
					password: "password123",
				}),
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("register", () => {
		it("should return user and token when registration is successful", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				createdAt: new Date(),
			};

			mockUsersService.create.mockResolvedValue(mockUser);
			mockJwtService.sign.mockReturnValue("mock-jwt-token");

			const result = await service.register({
				email: "test@example.com",
				password: "Password123!",
			});

			expect(result).toEqual({
				user: {
					id: 1,
					email: "test@example.com",
					createdAt: mockUser.createdAt,
				},
				token: "mock-jwt-token",
			});
		});

		it("should throw ConflictException when email is already in use", async () => {
			mockUsersService.create.mockRejectedValue(
				new ConflictException("Email já está em uso"),
			);

			await expect(
				service.register({
					email: "test@example.com",
					password: "Password123!",
				}),
			).rejects.toThrow(ConflictException);
		});
	});

	describe("verifyToken", () => {
		it("should return payload when token is valid", async () => {
			const mockPayload = { email: "test@example.com", sub: 1 };
			mockJwtService.verify.mockReturnValue(mockPayload);

			const result = await service.verifyToken("valid-token");

			expect(result).toEqual(mockPayload);
		});

		it("should throw UnauthorizedException when token is invalid", async () => {
			mockJwtService.verify.mockImplementation(() => {
				throw new Error("Invalid token");
			});

			await expect(service.verifyToken("invalid-token")).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});
});
