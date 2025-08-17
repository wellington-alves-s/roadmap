import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name);

	constructor(private prisma: PrismaService) {}

	async create(createNotificationDto: CreateNotificationDto) {
		this.logger.log("Creating new notification");

		return this.prisma.notification.create({
			data: createNotificationDto,
		});
	}

	async findAll() {
		return this.prisma.notification.findMany({
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findByUser(userId: number) {
		return this.prisma.notification.findMany({
			where: { userId },
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findOne(id: number) {
		const notification = await this.prisma.notification.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!notification) {
			throw new NotFoundException("Notificação não encontrada");
		}

		return notification;
	}

	async update(id: number, updateNotificationDto: UpdateNotificationDto) {
		const notification = await this.prisma.notification.findUnique({
			where: { id },
		});

		if (!notification) {
			throw new NotFoundException("Notificação não encontrada");
		}

		return this.prisma.notification.update({
			where: { id },
			data: updateNotificationDto,
		});
	}

	async remove(id: number) {
		const notification = await this.prisma.notification.findUnique({
			where: { id },
		});

		if (!notification) {
			throw new NotFoundException("Notificação não encontrada");
		}

		return this.prisma.notification.delete({
			where: { id },
		});
	}

	async markAsRead(id: number) {
		const notification = await this.prisma.notification.findUnique({
			where: { id },
		});

		if (!notification) {
			throw new NotFoundException("Notificação não encontrada");
		}

		return this.prisma.notification.update({
			where: { id },
			data: { read: true },
		});
	}

	async markAllAsRead(userId: number) {
		return this.prisma.notification.updateMany({
			where: { userId, read: false },
			data: { read: true },
		});
	}

	async clearAllByUser(userId: number) {
		this.logger.log(`Clearing all notifications for user ${userId}`);
		
		const deletedNotifications = await this.prisma.notification.deleteMany({
			where: { userId },
		});

		this.logger.log(`Deleted ${deletedNotifications.count} notifications for user ${userId}`);
		
		return {
			message: `${deletedNotifications.count} notificações removidas com sucesso`,
			deletedCount: deletedNotifications.count,
		};
	}

	async getUnreadCount(userId: number) {
		return this.prisma.notification.count({
			where: { userId, read: false },
		});
	}

	async createSystemNotification(
		userId: number,
		title: string,
		message: string,
		type: string = "system",
	) {
		this.logger.log(`Creating system notification for user ${userId}`);

		return this.prisma.notification.create({
			data: {
				userId,
				title,
				message,
				type,
			},
		});
	}
}
