-- Script para remover conquistas duplicadas
-- Manter apenas a primeira conquista (menor ID) para cada usuário+conquista

-- Ver duplicatas antes da limpeza
SELECT 
    userId, 
    achievementId, 
    COUNT(*) as count,
    GROUP_CONCAT(id ORDER BY id) as ids
FROM userachievement 
GROUP BY userId, achievementId 
HAVING COUNT(*) > 1
ORDER BY userId, achievementId;

-- Remover duplicatas (manter apenas o primeiro ID para cada combinação userId+achievementId)
DELETE ua1 FROM userachievement ua1
INNER JOIN userachievement ua2 
WHERE ua1.userId = ua2.userId 
  AND ua1.achievementId = ua2.achievementId 
  AND ua1.id > ua2.id;

-- Verificar se ainda há duplicatas
SELECT 
    userId, 
    achievementId, 
    COUNT(*) as count
FROM userachievement 
GROUP BY userId, achievementId 
HAVING COUNT(*) > 1;