/*
  Warnings:

  - You are about to drop the `kelas_dosen` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kelas_mahasiswa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `khs_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `krs_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sumatif_nilai_awal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kelas_dosen` DROP FOREIGN KEY `kelas_dosen_dosenId_fkey`;

-- DropForeignKey
ALTER TABLE `kelas_dosen` DROP FOREIGN KEY `kelas_dosen_kelasId_fkey`;

-- DropForeignKey
ALTER TABLE `kelas_mahasiswa` DROP FOREIGN KEY `kelas_mahasiswa_kelasId_fkey`;

-- DropForeignKey
ALTER TABLE `kelas_mahasiswa` DROP FOREIGN KEY `kelas_mahasiswa_krsDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `khs_detail` DROP FOREIGN KEY `khs_detail_krsDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `krs_detail` DROP FOREIGN KEY `krs_detail_krsId_fkey`;

-- DropForeignKey
ALTER TABLE `krs_detail` DROP FOREIGN KEY `krs_detail_mkId_fkey`;

-- DropForeignKey
ALTER TABLE `sumatif_nilai_awal` DROP FOREIGN KEY `sumatif_nilai_awal_khsDetailId_fkey`;

-- DropForeignKey
ALTER TABLE `sumatif_nilai_awal` DROP FOREIGN KEY `sumatif_nilai_awal_sumatifPersenId_fkey`;

-- DropForeignKey
ALTER TABLE `sumatifpersen` DROP FOREIGN KEY `SumatifPersen_mkId_fkey`;

-- DropForeignKey
ALTER TABLE `sumatifpersen` DROP FOREIGN KEY `SumatifPersen_parentId_fkey`;

-- DropTable
DROP TABLE `kelas_dosen`;

-- DropTable
DROP TABLE `kelas_mahasiswa`;

-- DropTable
DROP TABLE `khs_detail`;

-- DropTable
DROP TABLE `krs_detail`;

-- DropTable
DROP TABLE `sumatif_nilai_awal`;

-- CreateTable
CREATE TABLE `Krsdetail` (
    `id_krs_detail` VARCHAR(191) NOT NULL,
    `krsId` VARCHAR(191) NOT NULL,
    `mkId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_krs_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khsDetail` (
    `id_khs_detail` VARCHAR(191) NOT NULL,
    `krsDetailId` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_khs_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelasDosen` (
    `id_kelas_dosen` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_kelas_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelasMahasiswa` (
    `id_kelas_mahasiswa` VARCHAR(191) NOT NULL,
    `krsDetailId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_kelas_mahasiswa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumatifNilaiAwal` (
    `id_sumatif_nilai_awal` VARCHAR(191) NOT NULL,
    `sumatifPersenId` VARCHAR(191) NOT NULL,
    `khsDetailId` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_sumatif_nilai_awal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Krsdetail` ADD CONSTRAINT `Krsdetail_krsId_fkey` FOREIGN KEY (`krsId`) REFERENCES `krs`(`id_krs`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Krsdetail` ADD CONSTRAINT `Krsdetail_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khsDetail` ADD CONSTRAINT `khsDetail_krsDetailId_fkey` FOREIGN KEY (`krsDetailId`) REFERENCES `Krsdetail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelasDosen` ADD CONSTRAINT `kelasDosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id_dosen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelasDosen` ADD CONSTRAINT `kelasDosen_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id_kelas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelasMahasiswa` ADD CONSTRAINT `kelasMahasiswa_krsDetailId_fkey` FOREIGN KEY (`krsDetailId`) REFERENCES `Krsdetail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelasMahasiswa` ADD CONSTRAINT `kelasMahasiswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id_kelas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatifPersen` ADD CONSTRAINT `sumatifPersen_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sumatifPersen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatifPersen` ADD CONSTRAINT `sumatifPersen_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatifNilaiAwal` ADD CONSTRAINT `sumatifNilaiAwal_sumatifPersenId_fkey` FOREIGN KEY (`sumatifPersenId`) REFERENCES `sumatifPersen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatifNilaiAwal` ADD CONSTRAINT `sumatifNilaiAwal_khsDetailId_fkey` FOREIGN KEY (`khsDetailId`) REFERENCES `khsDetail`(`id_khs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;
