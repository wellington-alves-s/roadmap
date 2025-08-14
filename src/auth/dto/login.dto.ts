import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
	@ApiProperty({
		description: "Email do usuário",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Email deve ser válido" })
	@IsNotEmpty({ message: "Email é obrigatório" })
	email: string;

	@ApiProperty({
		description: "Senha do usuário",
		example: "password123",
		minLength: 6,
		maxLength: 50,
	})
	@IsString({ message: "Senha deve ser uma string" })
	@IsNotEmpty({ message: "Senha é obrigatória" })
	@MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
	@MaxLength(50, { message: "Senha deve ter no máximo 50 caracteres" })
	password: string;
}
