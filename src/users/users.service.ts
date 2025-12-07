import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.prisma.user.findUnique({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new ConflictException("Email já está em uso");
		}

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

		const user = await this.prisma.user.create({
			data: {
				email: createUserDto.email,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				createdAt: true,
			},
		});

		return user;
	}

	async findAll() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				email: true,
				createdAt: true,
			},
		});
	}

	async findOne(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				createdAt: true,
				progress: {
					include: {
						topic: {
							include: {
								level: true,
							},
						},
					},
				},
			},
		});

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		return user;
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async updatePassword(id: number, hashedPassword: string) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		await this.prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
		});

		return { message: "Senha atualizada com sucesso" };
	}

	async remove(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		await this.prisma.user.delete({
			where: { id },
		});

		return { message: "Usuário removido com sucesso" };
	}
}
