import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAchievementDto {
	@ApiProperty({
		description: "Nome da conquista",
		example: "Primeiro Passo",
	})
	@IsString({ message: "Nome deve ser uma string" })
	@IsNotEmpty({ message: "Nome é obrigatório" })
	name: string;

	@ApiProperty({
		description: "Descrição da conquista",
		example: "Complete seu primeiro tópico",
	})
	@IsString({ message: "Descrição deve ser uma string" })
	@IsNotEmpty({ message: "Descrição é obrigatória" })
	description: string;

	@ApiProperty({
		description: "Ícone da conquista",
		example: "🏆",
	})
	@IsString({ message: "Ícone deve ser uma string" })
	@IsNotEmpty({ message: "Ícone é obrigatório" })
	icon: string;

	@ApiProperty({
		description: "Condições para conquistar (JSON)",
		example: '[{"type": "topics_completed", "value": 1}]',
	})
	@IsString({ message: "Condições devem ser uma string JSON" })
	@IsNotEmpty({ message: "Condições são obrigatórias" })
	condition: string;

	@ApiProperty({
		description: "XP recompensa",
		example: 100,
		default: 0,
	})
	@IsNumber({}, { message: "XP recompensa deve ser um número" })
	@IsOptional()
	xpReward?: number;
}
