/*
  Warnings:

  - You are about to drop the column `krsDetailId` on the `khsdetail` table. All the data in the column will be lost.
  - Added the required column `krsDetailI` to the `khsDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `khsdetail` DROP FOREIGN KEY `khsDetail_krsDetailId_fkey`;

-- DropIndex
DROP INDEX `khsDetail_krsDetailId_fkey` ON `khsdetail`;

-- AlterTable
ALTER TABLE `khsdetail` DROP COLUMN `krsDetailId`,
    ADD COLUMN `krsDetailI` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `khsDetail` ADD CONSTRAINT `khsDetail_krsDetailI_fkey` FOREIGN KEY (`krsDetailI`) REFERENCES `Krsdetail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;
