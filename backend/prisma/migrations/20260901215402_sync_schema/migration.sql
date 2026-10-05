/*
  Warnings:

  - You are about to drop the column `tamaño` on the `gabinete` table. All the data in the column will be lost.
  - Added the required column `tamano` to the `Gabinete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gabinete` DROP COLUMN `tamaño`,
    ADD COLUMN `tamano` ENUM('FULL_TOWER', 'MID_TOWER', 'MINI_TOWER') NOT NULL;
