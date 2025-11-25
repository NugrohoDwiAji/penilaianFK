/*
  Warnings:

  - The primary key for the `sumatifnilaiawal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_sumatif_nilai_awal` on the `sumatifnilaiawal` table. All the data in the column will be lost.
  - The required column `id` was added to the `sumatifNilaiAwal` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `kelas` DROP FOREIGN KEY `kelas_sumatifPersenId_fkey`;

-- DropIndex
DROP INDEX `kelas_sumatifPersenId_fkey` ON `kelas`;

-- AlterTable
ALTER TABLE `kelas` MODIFY `sumatifPersenId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `khsdetail` ALTER COLUMN `krsDetailId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `sumatifnilaiawal` DROP PRIMARY KEY,
    DROP COLUMN `id_sumatif_nilai_awal`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_sumatifPersenId_fkey` FOREIGN KEY (`sumatifPersenId`) REFERENCES `sumatifPersen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
