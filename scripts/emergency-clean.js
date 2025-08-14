const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function emergencyClean() {
    try {
        console.log('🚨 LIMPEZA EMERGENCIAL - Removendo TODAS as conquistas duplicadas...');
        
        // 1. Contar total antes
        const totalBefore = await prisma.userachievement.count();
        console.log('📊 Total de conquistas antes:', totalBefore);
        
        // 2. Encontrar e remover duplicatas usando SQL raw mais simples
        console.log('🔍 Buscando duplicatas...');
        
        // SQL para encontrar IDs das duplicatas (manter apenas o menor ID de cada grupo)
        const duplicateIds = await prisma.$queryRaw`
            SELECT ua1.id 
            FROM userachievement ua1
            JOIN userachievement ua2 ON ua1.userId = ua2.userId 
                AND ua1.achievementId = ua2.achievementId 
                AND ua1.id > ua2.id
        `;
        
        console.log('🗑️ Duplicatas encontradas:', duplicateIds.length);
        
        if (duplicateIds.length > 0) {
            // Extrair apenas os IDs
            const idsToDelete = duplicateIds.map(row => row.id);
            console.log('🗂️ IDs para deletar:', idsToDelete);
            
            // Deletar as duplicatas usando deleteMany
            const deleteResult = await prisma.userachievement.deleteMany({
                where: {
                    id: {
                        in: idsToDelete
                    }
                }
            });
            
            console.log('✅ Duplicatas removidas:', deleteResult.count);
        }
        
        // 3. Contar total depois
        const totalAfter = await prisma.userachievement.count();
        console.log('📊 Total de conquistas depois:', totalAfter);
        console.log('📈 Conquistas removidas:', totalBefore - totalAfter);
        
        // 4. Verificar se ainda há duplicatas
        const remainingDuplicates = await prisma.$queryRaw`
            SELECT userId, achievementId, COUNT(*) as count
            FROM userachievement 
            GROUP BY userId, achievementId 
            HAVING COUNT(*) > 1
        `;
        
        if (remainingDuplicates.length === 0) {
            console.log('🎉 SUCESSO TOTAL! Não há mais duplicatas!');
        } else {
            console.log('⚠️ Ainda há duplicatas:', remainingDuplicates);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

emergencyClean();