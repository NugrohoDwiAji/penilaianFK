/*
  Warnings:

  - You are about to drop the column `mhsId` on the `krs` table. All the data in the column will be lost.
  - Added the required column `nim` to the `krs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `khsDetailId` to the `sumatif_nilai_awal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `krs` DROP FOREIGN KEY `krs_mhsId_fkey`;

-- DropIndex
DROP INDEX `krs_mhsId_fkey` ON `krs`;

-- AlterTable
ALTER TABLE `dosen` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `kelas` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `kelas_dosen` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `kelas_mahasiswa` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `khs` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `khs_detail` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `krs` DROP COLUMN `mhsId`,
    ADD COLUMN `nim` VARCHAR(191) NOT NULL,
    MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `krs_detail` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `mahasiswa` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `matakuliah` MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sumatif_nilai_awal` ADD COLUMN `khsDetailId` VARCHAR(191) NOT NULL,
    MODIFY `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `sumatifpersen` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatif_nilai_awal` ADD CONSTRAINT `sumatif_nilai_awal_khsDetailId_fkey` FOREIGN KEY (`khsDetailId`) REFERENCES `khs_detail`(`id_khs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;
