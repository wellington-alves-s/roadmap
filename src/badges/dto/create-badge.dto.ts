import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBadgeDto {
	@ApiProperty({
		description: "Nome do badge",
		example: "Nível 1 — Fundamentos da Web e da Internet",
	})
	@IsString({ message: "Nome deve ser uma string" })
	@IsNotEmpty({ message: "Nome é obrigatório" })
	name: string;

	@ApiProperty({
		description: "Descrição do badge",
		example: "Conquistou o conhecimento fundamental de como a internet funciona por trás dos navegadores.",
	})
	@IsString({ message: "Descrição deve ser uma string" })
	@IsNotEmpty({ message: "Descrição é obrigatória" })
	description: string;

	@ApiProperty({
		description: "Ícone do badge (emoji)",
		example: "🌐",
	})
	@IsString({ message: "Ícone deve ser uma string" })
	@IsNotEmpty({ message: "Ícone é obrigatório" })
	icon: string;

	@ApiProperty({
		description: "Categoria do badge",
		example: "level",
	})
	@IsString({ message: "Categoria deve ser uma string" })
	@IsNotEmpty({ message: "Categoria é obrigatória" })
	category: string;

	@ApiProperty({
		description: "ID do roadmap (opcional)",
		example: 1,
		required: false,
	})
	@IsNumber({}, { message: "Roadmap ID deve ser um número" })
	@IsOptional()
	roadmapId?: number;
}

