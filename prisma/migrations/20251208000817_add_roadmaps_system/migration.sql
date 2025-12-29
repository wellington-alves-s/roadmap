/*
  Warnings:

  - A unique constraint covering the columns `[roadmapId,name]` on the table `level` will be added. If there are existing duplicate values, this will fail.

*/
-- Criar tabela roadmap (se não existir)
CREATE TABLE IF NOT EXISTS `roadmap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `roadmap_isDefault_idx`(`isDefault`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Remover índice único antigo Level_name_key (apenas se existir)
-- NOTA: Fazemos isso manualmente para evitar conflitos
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'level' 
    AND INDEX_NAME = 'Level_name_key'
);

SET @sql = IF(@index_exists > 0,
    'ALTER TABLE `level` DROP INDEX `Level_name_key`',
    'SELECT "Índice Level_name_key não existe" AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Criar índice para roadmapId (se não existir)
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'level' 
    AND INDEX_NAME = 'level_roadmapId_idx'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX `level_roadmapId_idx` ON `level`(`roadmapId`)',
    'SELECT "Índice level_roadmapId_idx já existe" AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Criar índice único Level_roadmapId_name_key (se não existir)
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'level' 
    AND INDEX_NAME = 'Level_roadmapId_name_key'
);

SET @sql = IF(@index_exists = 0,
    'CREATE UNIQUE INDEX `Level_roadmapId_name_key` ON `level`(`roadmapId`, `name`)',
    'SELECT "Índice Level_roadmapId_name_key já existe" AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar foreign key (se não existir)
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'level' 
    AND CONSTRAINT_NAME = 'level_roadmapId_fkey'
);

SET @sql = IF(@fk_exists = 0,
    'ALTER TABLE `level` ADD CONSTRAINT `level_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
    'SELECT "Foreign key level_roadmapId_fkey já existe" AS info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
