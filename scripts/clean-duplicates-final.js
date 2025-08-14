const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanAllDuplicates() {
    try {
        console.log('🧹 LIMPEZA FINAL - Removendo TODAS as conquistas duplicadas...');
        
        // 1. Mostrar duplicatas antes da limpeza
        const duplicatesBefore = await prisma.$queryRaw`
            SELECT userId, achievementId, COUNT(*) as count
            FROM userachievement 
            GROUP BY userId, achievementId 
            HAVING COUNT(*) > 1
        `;
        
        console.log('📊 Duplicatas encontradas:', duplicatesBefore.length);
        duplicatesBefore.forEach(dup => {
            console.log(`   - Usuário ${dup.userId}, Conquista ${dup.achievementId}: ${dup.count} vezes`);
        });
        
        // 2. Executar limpeza usando SQL raw
        const result = await prisma.$executeRaw`
            DELETE ua1 FROM userachievement ua1
            INNER JOIN userachievement ua2 
            WHERE ua1.userId = ua2.userId 
              AND ua1.achievementId = ua2.achievementId 
              AND ua1.id > ua2.id
        `;
        
        console.log('✅ Duplicatas removidas:', result);
        
        // 3. Verificar se ainda há duplicatas
        const duplicatesAfter = await prisma.$queryRaw`
            SELECT userId, achievementId, COUNT(*) as count
            FROM userachievement 
            GROUP BY userId, achievementId 
            HAVING COUNT(*) > 1
        `;
        
        console.log('📊 Duplicatas restantes:', duplicatesAfter.length);
        
        if (duplicatesAfter.length === 0) {
            console.log('🎉 SUCESSO! Todas as duplicatas foram removidas!');
        } else {
            console.log('⚠️ Ainda há duplicatas restantes:', duplicatesAfter);
        }
        
        // 4. Mostrar estatísticas finais
        const totalAchievements = await prisma.userachievement.count();
        console.log('📈 Total de conquistas no banco:', totalAchievements);
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanAllDuplicates();