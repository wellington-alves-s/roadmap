const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAchievementsSystem() {
    try {
        console.log('🚨 RESETANDO SISTEMA DE CONQUISTAS COMPLETAMENTE...');
        
        // 1. Remover todas as conquistas dos usuários
        console.log('🗑️ Removendo todas as conquistas dos usuários...');
        const deletedUserAchievements = await prisma.userachievement.deleteMany({});
        console.log(`✅ ${deletedUserAchievements.count} conquistas de usuários removidas`);
        
        // 2. Remover todas as conquistas existentes
        console.log('🗑️ Removendo todas as conquistas do sistema...');
        const deletedAchievements = await prisma.achievement.deleteMany({});
        console.log(`✅ ${deletedAchievements.count} conquistas do sistema removidas`);
        
        // 3. Criar novas conquistas reorganizadas
        console.log('🆕 Criando novo sistema de conquistas...');
        
        const newAchievements = await prisma.achievement.createMany({
            data: [
                // Conquistas de Primeiros Passos
                {
                    name: "Primeiro Passo",
                    description: "Complete seu primeiro tópico",
                    icon: "🎯",
                    condition: '[{"type": "topics_completed_exactly", "value": 1}]',
                    xpReward: 50,
                },
                {
                    name: "Em Movimento",
                    description: "Complete 3 tópicos",
                    icon: "🚶",
                    condition: '[{"type": "topics_completed_exactly", "value": 3}]',
                    xpReward: 75,
                },
                {
                    name: "Estudioso",
                    description: "Complete 5 tópicos",
                    icon: "📚",
                    condition: '[{"type": "topics_completed_exactly", "value": 5}]',
                    xpReward: 100,
                },
                {
                    name: "Persistente",
                    description: "Complete 10 tópicos",
                    icon: "💪",
                    condition: '[{"type": "topics_completed_exactly", "value": 10}]',
                    xpReward: 150,
                },
                {
                    name: "Dedicado",
                    description: "Complete 20 tópicos",
                    icon: "⭐",
                    condition: '[{"type": "topics_completed_exactly", "value": 20}]',
                    xpReward: 200,
                },
                {
                    name: "Mestre",
                    description: "Complete 50 tópicos",
                    icon: "👑",
                    condition: '[{"type": "topics_completed_exactly", "value": 50}]',
                    xpReward: 300,
                },

                // Conquistas de Níveis
                {
                    name: "Fundamentos Concluídos",
                    description: "Complete o Nível 1 - Fundamentos da Web",
                    icon: "🌐",
                    condition: '[{"type": "level_completed", "value": 1}]',
                    xpReward: 100,
                },
                {
                    name: "HTML Master",
                    description: "Complete o Nível 2 - HTML com Maestria",
                    icon: "📄",
                    condition: '[{"type": "level_completed", "value": 2}]',
                    xpReward: 100,
                },
                {
                    name: "CSS Expert",
                    description: "Complete o Nível 3 - CSS do Básico ao Avançado",
                    icon: "🎨",
                    condition: '[{"type": "level_completed", "value": 3}]',
                    xpReward: 125,
                },

                // Conquistas de Streak
                {
                    name: "Consistente",
                    description: "Mantenha um streak de 3 dias",
                    icon: "🔥",
                    condition: '[{"type": "streak_days", "value": 3}]',
                    xpReward: 100,
                },
                {
                    name: "Disciplinado",
                    description: "Mantenha um streak de 7 dias",
                    icon: "🎖️",
                    condition: '[{"type": "streak_days", "value": 7}]',
                    xpReward: 200,
                },

                // Conquistas de XP
                {
                    name: "Colecionador",
                    description: "Acumule 500 XP",
                    icon: "💰",
                    condition: '[{"type": "total_xp", "value": 500}]',
                    xpReward: 100,
                },
                {
                    name: "XP Master",
                    description: "Acumule 1000 XP",
                    icon: "💎",
                    condition: '[{"type": "total_xp", "value": 1000}]',
                    xpReward: 200,
                },
            ],
        });
        
        console.log(`✅ ${newAchievements.count} novas conquistas criadas`);
        
        // 4. Verificar resultado final
        const totalAchievements = await prisma.achievement.count();
        const totalUserAchievements = await prisma.userachievement.count();
        
        console.log('📊 Resultado final:');
        console.log(`   - Conquistas no sistema: ${totalAchievements}`);
        console.log(`   - Conquistas de usuários: ${totalUserAchievements}`);
        console.log('');
        console.log('🎉 SISTEMA DE CONQUISTAS COMPLETAMENTE REORGANIZADO!');
        console.log('');
        console.log('📋 Nova estrutura:');
        console.log('   ✅ Conquistas "exatas" - evitam duplicação');
        console.log('   ✅ Sistema mais preciso e balanceado');
        console.log('   ✅ Proteção total contra duplicatas');
        
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAchievementsSystem();