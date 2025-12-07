/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,topicId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Level_name_key` ON `Level`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Progress_userId_topicId_key` ON `Progress`(`userId`, `topicId`);
