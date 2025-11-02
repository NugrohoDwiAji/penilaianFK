/*
  Warnings:

  - Added the required column `semester` to the `kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thn_akademik` to the `kelas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kelas` ADD COLUMN `semester` INTEGER NOT NULL,
    ADD COLUMN `thn_akademik` INTEGER NOT NULL;
