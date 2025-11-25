/*
  Warnings:

  - Added the required column `Kurikulum` to the `matakuliah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `matakuliah` ADD COLUMN `Kurikulum` VARCHAR(191) NOT NULL;
