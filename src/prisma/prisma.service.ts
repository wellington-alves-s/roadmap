import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(PrismaService.name);

	async onModuleInit() {
		// Verificar se DATABASE_URL está definida antes de conectar
		if (!process.env.DATABASE_URL) {
			this.logger.error("❌ DATABASE_URL não está definida!");
			this.logger.error("");
			this.logger.error("📋 Para configurar no EasyPanel:");
			this.logger.error("   1. Acesse o painel do EasyPanel");
			this.logger.error("   2. Vá para o serviço da aplicação");
			this.logger.error("   3. Clique na aba 'Environment'");
			this.logger.error("   4. Adicione a variável DATABASE_URL:");
			this.logger.error("");
			this.logger.error("   DATABASE_URL=mysql://[usuario]:[senha]@[hostname]:3306/[banco]");
			this.logger.error("");
			this.logger.error("   Exemplo:");
			this.logger.error("   DATABASE_URL=mysql://mysql:senha@app_database_roadmap:3306/roadmap_db");
			this.logger.error("");
			this.logger.error("📚 Consulte: docs/EASYPANEL_DATABASE_CONNECTION_FIX.md");
			throw new Error(
				"DATABASE_URL não está definida. Configure a variável de ambiente no EasyPanel.",
			);
		}

		try {
			this.logger.log("🔌 Conectando ao banco de dados...");
			await this.$connect();
			this.logger.log("✅ Conectado ao banco de dados com sucesso!");
		} catch (error: any) {
			this.logger.error("❌ Erro ao conectar ao banco de dados:");
			this.logger.error(`   ${error.message}`);
			
			// Verificar se é erro de variável de ambiente
			if (error.message?.includes("Environment variable not found") || 
			    error.message?.includes("DATABASE_URL")) {
				this.logger.error("");
				this.logger.error("📋 SOLUÇÃO: Configure DATABASE_URL no EasyPanel");
				this.logger.error("   Formato: mysql://[usuario]:[senha]@[hostname]:3306/[banco]");
				this.logger.error("   Hostname deve ser o nome do serviço MySQL (ex: app_database_roadmap)");
				this.logger.error("   NÃO use 'localhost' em ambientes Docker!");
			}
			
			throw error;
		}
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}
