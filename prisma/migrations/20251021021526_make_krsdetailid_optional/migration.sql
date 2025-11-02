/*
  Warnings:

  - You are about to drop the column `krsDetailI` on the `khsdetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `khsdetail` DROP FOREIGN KEY `khsDetail_krsDetailI_fkey`;

-- DropIndex
DROP INDEX `khsDetail_krsDetailI_fkey` ON `khsdetail`;

-- AlterTable
ALTER TABLE `khsdetail` DROP COLUMN `krsDetailI`,
    ADD COLUMN `krsDetailId` VARCHAR(191) NOT NULL DEFAULT 'TEMP_ID';

-- AddForeignKey
ALTER TABLE `khsDetail` ADD CONSTRAINT `khsDetail_krsDetailId_fkey` FOREIGN KEY (`krsDetailId`) REFERENCES `krsdetail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;
