const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
    try {
        console.log('🔍 Verificando conquistas duplicadas...');
        
        // Buscar todas as conquistas dos usuários
        const achievements = await prisma.userachievement.findMany({
            include: {
                achievement: true,
                user: true
            },
            orderBy: [
                { userId: 'asc' },
                { achievementId: 'asc' },
                { id: 'asc' }
            ]
        });
        
        console.log(`📊 Total de conquistas no banco: ${achievements.length}`);
        
        // Agrupar por usuário e conquista
        const groups = {};
        
        achievements.forEach(ach => {
            const key = `${ach.userId}-${ach.achievementId}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(ach);
        });
        
        // Encontrar duplicatas
        let duplicateCount = 0;
        let duplicateIds = [];
        
        Object.keys(groups).forEach(key => {
            const group = groups[key];
            if (group.length > 1) {
                console.log(`🔴 DUPLICATA ENCONTRADA:`);
                console.log(`   Usuário ID: ${group[0].userId}`);
                console.log(`   Conquista: ${group[0].achievement.name}`);
                console.log(`   Quantidade: ${group.length}`);
                console.log(`   IDs: ${group.map(g => g.id).join(', ')}`);
                console.log('');
                
                // Manter o primeiro, marcar o resto para remoção
                for (let i = 1; i < group.length; i++) {
                    duplicateIds.push(group[i].id);
                    duplicateCount++;
                }
            }
        });
        
        console.log(`📈 Resumo:`);
        console.log(`   - Conquistas únicas: ${Object.keys(groups).length}`);
        console.log(`   - Conquistas duplicadas: ${duplicateCount}`);
        console.log(`   - IDs para remover: [${duplicateIds.join(', ')}]`);
        
        if (duplicateIds.length > 0) {
            console.log('');
            console.log('🧹 Removendo duplicatas...');
            
            const deleteResult = await prisma.userachievement.deleteMany({
                where: {
                    id: { in: duplicateIds }
                }
            });
            
            console.log(`✅ ${deleteResult.count} conquistas duplicadas removidas!`);
        } else {
            console.log('✅ Nenhuma duplicata encontrada!');
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDuplicates();