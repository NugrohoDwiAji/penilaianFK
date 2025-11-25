/*
  Warnings:

  - Added the required column `list` to the `sumatifPersen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sumatifpersen` ADD COLUMN `list` INTEGER NOT NULL;
