/**
 * Script para criar/corrigir usuário de teste
 * Execute: node scripts/fix-test-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixTestUser() {
	try {
		console.log('🔍 Verificando usuário de teste...');
		
		const email = 'dev@roadmap.com';
		const password = '123456';
		
		// Verificar se o usuário existe
		let user = await prisma.user.findUnique({
			where: { email },
		});
		
		// Gerar hash da senha
		const hashedPassword = await bcrypt.hash(password, 10);
		
		if (user) {
			console.log('✅ Usuário encontrado. Atualizando senha...');
			console.log(`   ID: ${user.id}`);
			console.log(`   Email: ${user.email}`);
			
			// Atualizar senha
			await prisma.user.update({
				where: { email },
				data: { password: hashedPassword },
			});
			
			console.log('✅ Senha atualizada com sucesso!');
			
			// Verificar se a senha está correta
			const verifyPassword = await bcrypt.compare(password, hashedPassword);
			console.log(`   Verificação de senha: ${verifyPassword ? '✅ OK' : '❌ ERRO'}`);
		} else {
			console.log('📝 Criando novo usuário de teste...');
			
			// Criar usuário
			user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
			});
			
			console.log('✅ Usuário criado com sucesso!');
			console.log(`   ID: ${user.id}`);
		}
		
		console.log('\n📋 Credenciais de teste:');
		console.log(`   Email: ${email}`);
		console.log(`   Senha: ${password}`);
		console.log('\n✅ Pronto! Você pode fazer login agora.');
		
	} catch (error) {
		console.error('❌ Erro:', error.message);
		console.error('Stack:', error.stack);
	} finally {
		await prisma.$disconnect();
	}
}

fixTestUser();

