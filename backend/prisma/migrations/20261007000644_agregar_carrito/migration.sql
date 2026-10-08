-- CreateTable
CREATE TABLE `Carrito` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Carrito_usuarioId_key`(`usuarioId`),
    INDEX `Carrito_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemCarrito` (
    `id` VARCHAR(191) NOT NULL,
    `carritoId` VARCHAR(191) NOT NULL,
    `gabineteId` VARCHAR(191) NULL,
    `disenoGuardadoId` VARCHAR(191) NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ItemCarrito_carritoId_idx`(`carritoId`),
    INDEX `ItemCarrito_gabineteId_idx`(`gabineteId`),
    INDEX `ItemCarrito_disenoGuardadoId_idx`(`disenoGuardadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Carrito` ADD CONSTRAINT `Carrito_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemCarrito` ADD CONSTRAINT `ItemCarrito_carritoId_fkey` FOREIGN KEY (`carritoId`) REFERENCES `Carrito`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemCarrito` ADD CONSTRAINT `ItemCarrito_gabineteId_fkey` FOREIGN KEY (`gabineteId`) REFERENCES `Gabinete`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemCarrito` ADD CONSTRAINT `ItemCarrito_disenoGuardadoId_fkey` FOREIGN KEY (`disenoGuardadoId`) REFERENCES `DisenoGuardado`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
