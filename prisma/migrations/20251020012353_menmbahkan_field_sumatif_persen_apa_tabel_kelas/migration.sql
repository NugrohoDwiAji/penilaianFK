/*
  Warnings:

  - Added the required column `sumatifPersenId` to the `kelas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kelas` ADD COLUMN `sumatifPersenId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_sumatifPersenId_fkey` FOREIGN KEY (`sumatifPersenId`) REFERENCES `sumatifPersen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
