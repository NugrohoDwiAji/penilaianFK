-- DropForeignKey
ALTER TABLE `kelasdosen` DROP FOREIGN KEY `kelasDosen_dosenId_fkey`;

-- DropForeignKey
ALTER TABLE `kelasmahasiswa` DROP FOREIGN KEY `kelasMahasiswa_kelasId_fkey`;

-- DropIndex
DROP INDEX `kelasDosen_dosenId_fkey` ON `kelasdosen`;

-- DropIndex
DROP INDEX `kelasMahasiswa_kelasId_fkey` ON `kelasmahasiswa`;

-- AddForeignKey
ALTER TABLE `kelasDosen` ADD CONSTRAINT `kelasDosen_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `dosen`(`id_dosen`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelasMahasiswa` ADD CONSTRAINT `kelasMahasiswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `kelas`(`id_kelas`) ON DELETE CASCADE ON UPDATE CASCADE;
