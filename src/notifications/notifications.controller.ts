import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	ParseIntPipe,
	Version,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post()
	@Version("1")
	@ApiOperation({ summary: "Criar nova notificação" })
	@ApiResponse({ status: 201, description: "Notificação criada com sucesso" })
	create(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationsService.create(createNotificationDto);
	}

	@Get()
	@Version("1")
	@ApiOperation({ summary: "Listar todas as notificações" })
	@ApiResponse({ status: 200, description: "Lista de notificações" })
	findAll() {
		return this.notificationsService.findAll();
	}

	@Get("user/:userId")
	@Version("1")
	@ApiOperation({ summary: "Buscar notificações do usuário" })
	@ApiResponse({ status: 200, description: "Notificações do usuário" })
	findByUser(@Param("userId", ParseIntPipe) userId: number) {
		return this.notificationsService.findByUser(userId);
	}

	@Get(":id")
	@Version("1")
	@ApiOperation({ summary: "Buscar notificação por ID" })
	@ApiResponse({ status: 200, description: "Notificação encontrada" })
	@ApiResponse({ status: 404, description: "Notificação não encontrada" })
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.notificationsService.findOne(id);
	}

	@Patch(":id")
	@Version("1")
	@ApiOperation({ summary: "Atualizar notificação" })
	@ApiResponse({ status: 200, description: "Notificação atualizada com sucesso" })
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateNotificationDto: UpdateNotificationDto,
	) {
		return this.notificationsService.update(id, updateNotificationDto);
	}

	@Delete(":id")
	@Version("1")
	@ApiOperation({ summary: "Remover notificação" })
	@ApiResponse({ status: 200, description: "Notificação removida com sucesso" })
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.notificationsService.remove(id);
	}

	@Patch(":id/read")
	@Version("1")
	@ApiOperation({ summary: "Marcar notificação como lida" })
	@ApiResponse({ status: 200, description: "Notificação marcada como lida" })
	markAsRead(@Param("id", ParseIntPipe) id: number) {
		return this.notificationsService.markAsRead(id);
	}

	@Patch("user/:userId/read-all")
	@Version("1")
	@ApiOperation({ summary: "Marcar todas as notificações do usuário como lidas" })
	@ApiResponse({ status: 200, description: "Notificações marcadas como lidas" })
	markAllAsRead(@Param("userId", ParseIntPipe) userId: number) {
		return this.notificationsService.markAllAsRead(userId);
	}

	@Get("user/:userId/unread-count")
	@Version("1")
	@ApiOperation({ summary: "Contar notificações não lidas do usuário" })
	@ApiResponse({ status: 200, description: "Contagem de notificações não lidas" })
	getUnreadCount(@Param("userId", ParseIntPipe) userId: number) {
		return this.notificationsService.getUnreadCount(userId);
	}

	@Delete("user/:userId/clear")
	@Version("1")
	@ApiOperation({ summary: "Limpar todas as notificações do usuário" })
	@ApiResponse({ status: 200, description: "Todas as notificações foram removidas" })
	clearAllByUser(@Param("userId", ParseIntPipe) userId: number) {
		return this.notificationsService.clearAllByUser(userId);
	}
}
