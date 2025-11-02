-- CreateTable
CREATE TABLE `mahasiswa` (
    `id_mhs` VARCHAR(191) NOT NULL,
    `nama_mhs` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`id_mhs`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `krs` (
    `id_krs` VARCHAR(191) NOT NULL,
    `mhsId` VARCHAR(191) NOT NULL,
    `tahun_akademik` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_krs`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matakuliah` (
    `id_mk` VARCHAR(191) NOT NULL,
    `kode_mk` VARCHAR(191) NOT NULL,
    `nama_matakuliah` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `matakuliah_kode_mk_key`(`kode_mk`),
    PRIMARY KEY (`id_mk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `krs_detail` (
    `id_krs_detail` VARCHAR(191) NOT NULL,
    `krsId` VARCHAR(191) NOT NULL,
    `mkId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_krs_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khs` (
    `id_khs` VARCHAR(191) NOT NULL,
    `krsId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `khs_krsId_key`(`krsId`),
    PRIMARY KEY (`id_khs`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khs_detail` (
    `id_khs_detail` VARCHAR(191) NOT NULL,
    `krsDetailId` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_khs_detail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id_kelas` VARCHAR(191) NOT NULL,
    `nama_kelas` VARCHAR(191) NOT NULL,
    `validasi` BOOLEAN NOT NULL,
    `mkId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `kelas_nama_kelas_key`(`nama_kelas`),
    PRIMARY KEY (`id_kelas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id_dosen` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `nama_dosen` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `is_online` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dosen_nik_key`(`nik`),
    PRIMARY KEY (`id_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas_dosen` (
    `id_kelas_dosen` VARCHAR(191) NOT NULL,
    `dosenId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kelas_dosen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas_mahasiswa` (
    `id_kelas_mahasiswa` VARCHAR(191) NOT NULL,
    `krsDetailId` VARCHAR(191) NOT NULL,
    `kelasId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kelas_mahasiswa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SumatifPersen` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `bobot` INTEGER NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `mkId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumatif_nilai_awal` (
    `id_sumatif_nilai_awal` VARCHAR(191) NOT NULL,
    `sumatifPersenId` VARCHAR(191) NOT NULL,
    `nilai` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_sumatif_nilai_awal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `krs` ADD CONSTRAINT `krs_mhsId_fkey` FOREIGN KEY (`mhsId`) REFERENCES `mahasiswa`(`id_mhs`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs_detail` ADD CONSTRAINT `krs_detail_krsId_fkey` FOREIGN KEY (`krsId`) REFERENCES `krs`(`id_krs`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krs_detail` ADD CONSTRAINT `krs_detail_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khs` ADD CONSTRAINT `khs_krsId_fkey` FOREIGN KEY (`krsId`) REFERENCES `krs`(`id_krs`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khs_detail` ADD CONSTRAINT `khs_detail_krsDetailId_fkey` FOREIGN KEY (`krsDetailId`) REFERENCES `krs_detail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_dosen` ADD CONSTRAINT `kelas_dosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id_dosen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_dosen` ADD CONSTRAINT `kelas_dosen_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id_kelas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mahasiswa` ADD CONSTRAINT `kelas_mahasiswa_krsDetailId_fkey` FOREIGN KEY (`krsDetailId`) REFERENCES `krs_detail`(`id_krs_detail`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelas_mahasiswa` ADD CONSTRAINT `kelas_mahasiswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id_kelas`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumatifPersen` ADD CONSTRAINT `SumatifPersen_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `SumatifPersen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumatifPersen` ADD CONSTRAINT `SumatifPersen_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumatif_nilai_awal` ADD CONSTRAINT `sumatif_nilai_awal_sumatifPersenId_fkey` FOREIGN KEY (`sumatifPersenId`) REFERENCES `SumatifPersen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
