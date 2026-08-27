-- AlterTable
ALTER TABLE `inventariomovimiento` ADD COLUMN `gabineteId` VARCHAR(191) NULL,
    MODIFY `materialId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Gabinete` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `marca` VARCHAR(150) NOT NULL,
    `costoUnitario` DECIMAL(10, 2) NOT NULL,
    `stockActual` INTEGER NOT NULL DEFAULT 0,
    `stockMinimo` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `tamaño` ENUM('FULL_TOWER', 'MID_TOWER', 'MINI_TOWER') NOT NULL,
    `formato` ENUM('ATX', 'MICRO_ATX', 'ITX') NOT NULL,
    `materialChasis` ENUM('ACERO', 'ALUMINIO') NOT NULL,
    `panel` ENUM('VIDRIO_TEMPLADO', 'ACRILICO', 'MALLADO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventarioMovimiento` ADD CONSTRAINT `InventarioMovimiento_gabineteId_fkey` FOREIGN KEY (`gabineteId`) REFERENCES `Gabinete`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
