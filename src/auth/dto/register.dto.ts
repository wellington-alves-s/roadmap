import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
	@ApiProperty({
		description: "Email do usuário",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Email deve ser válido" })
	@IsNotEmpty({ message: "Email é obrigatório" })
	email: string;

	@ApiProperty({
		description: "Senha do usuário",
		example: "Password123!",
		minLength: 8,
		maxLength: 50,
	})
	@IsString({ message: "Senha deve ser uma string" })
	@IsNotEmpty({ message: "Senha é obrigatória" })
	@MinLength(8, { message: "Senha deve ter pelo menos 8 caracteres" })
	@MaxLength(50, { message: "Senha deve ter no máximo 50 caracteres" })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
		message:
			"Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial",
	})
	password: string;
}
