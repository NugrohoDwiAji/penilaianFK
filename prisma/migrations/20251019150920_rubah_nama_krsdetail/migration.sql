-- DropForeignKey
ALTER TABLE `krsdetail` DROP FOREIGN KEY `Krsdetail_krsId_fkey`;

-- DropForeignKey
ALTER TABLE `krsdetail` DROP FOREIGN KEY `Krsdetail_mkId_fkey`;

-- AddForeignKey
ALTER TABLE `krsdetail` ADD CONSTRAINT `krsdetail_krsId_fkey` FOREIGN KEY (`krsId`) REFERENCES `krs`(`id_krs`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `krsdetail` ADD CONSTRAINT `krsdetail_mkId_fkey` FOREIGN KEY (`mkId`) REFERENCES `matakuliah`(`id_mk`) ON DELETE RESTRICT ON UPDATE CASCADE;
