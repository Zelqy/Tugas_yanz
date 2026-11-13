-- CreateTable
CREATE TABLE `Destinasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NULL,
    `hargaTiket` DOUBLE NOT NULL,
    `ratingRata` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ulasan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinasiId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `komentar` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destinasiId` INTEGER NOT NULL,
    `namaFasilitas` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ulasan` ADD CONSTRAINT `Ulasan_destinasiId_fkey` FOREIGN KEY (`destinasiId`) REFERENCES `Destinasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fasilitas` ADD CONSTRAINT `Fasilitas_destinasiId_fkey` FOREIGN KEY (`destinasiId`) REFERENCES `Destinasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
