-- CreateTable
CREATE TABLE `CategoriaProducto` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CategoriaProducto_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `Gabinete` ADD COLUMN `categoriaId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Gabinete_categoriaId_idx` ON `Gabinete`(`categoriaId`);

-- AddForeignKey
ALTER TABLE `Gabinete` ADD CONSTRAINT `Gabinete_categoriaId_fkey`
    FOREIGN KEY (`categoriaId`) REFERENCES `CategoriaProducto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
