import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
	@ApiProperty({
		description: "Email do usuário para reset de senha",
		example: "user@example.com",
	})
	@IsEmail({}, { message: "Email deve ter um formato válido" })
	@IsNotEmpty({ message: "Email é obrigatório" })
	email: string;
}

export class ResetPasswordDto {
	@ApiProperty({
		description: "Token de reset de senha",
		example: "abc123def456ghi789",
	})
	@IsNotEmpty({ message: "Token é obrigatório" })
	token: string;

	@ApiProperty({
		description: "Nova senha do usuário",
		example: "novaSenha123",
		minLength: 6,
	})
	@IsNotEmpty({ message: "Nova senha é obrigatória" })
	newPassword: string;
}
