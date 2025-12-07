import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {
	@ApiProperty({
		description: "ID do usuário",
		example: 1,
	})
	@IsNumber({}, { message: "ID do usuário deve ser um número" })
	@IsNotEmpty({ message: "ID do usuário é obrigatório" })
	userId: number;

	@ApiProperty({
		description: "Título da notificação",
		example: "Nova conquista!",
	})
	@IsString({ message: "Título deve ser uma string" })
	@IsNotEmpty({ message: "Título é obrigatório" })
	title: string;

	@ApiProperty({
		description: "Mensagem da notificação",
		example: "Você conquistou uma nova medalha!",
	})
	@IsString({ message: "Mensagem deve ser uma string" })
	@IsNotEmpty({ message: "Mensagem é obrigatória" })
	message: string;

	@ApiProperty({
		description: "Tipo da notificação",
		example: "achievement",
		enum: ["achievement", "challenge", "reminder", "system"],
	})
	@IsString({ message: "Tipo deve ser uma string" })
	@IsIn(["achievement", "challenge", "reminder", "system"], {
		message: "Tipo deve ser achievement, challenge, reminder ou system",
	})
	@IsNotEmpty({ message: "Tipo é obrigatório" })
	type: string;
}
