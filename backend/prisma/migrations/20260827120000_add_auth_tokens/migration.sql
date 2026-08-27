CREATE TABLE `TokenAcceso` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `tipo` ENUM('VERIFICACION_EMAIL', 'RECUPERACION_PASSWORD') NOT NULL,
    `expiraEn` DATETIME(3) NOT NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TokenAcceso_tokenHash_key`(`tokenHash`),
    INDEX `TokenAcceso_usuarioId_tipo_idx`(`usuarioId`, `tipo`),
    INDEX `TokenAcceso_expiraEn_idx`(`expiraEn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `TokenAcceso` ADD CONSTRAINT `TokenAcceso_usuarioId_fkey`
    FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;