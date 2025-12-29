/*
  Warnings:

  - A unique constraint covering the columns `[userId,achievementId]` on the table `userachievement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,badgeId]` on the table `userbadge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `topic` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `videoUrl` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `resource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `topicId` INTEGER NOT NULL,

    INDEX `resource_topicId_idx`(`topicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `topicId` INTEGER NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `file_topicId_idx`(`topicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `UserAchievement_userId_achievementId_key` ON `userachievement`(`userId`, `achievementId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserBadge_userId_badgeId_key` ON `userbadge`(`userId`, `badgeId`);

-- AddForeignKey
ALTER TABLE `resource` ADD CONSTRAINT `resource_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `topic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
