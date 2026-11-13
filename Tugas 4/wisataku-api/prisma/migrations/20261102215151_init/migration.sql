-- CreateTable
CREATE TABLE "Destinasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "lokasi" TEXT,
    "hargaTiket" REAL NOT NULL,
    "ratingRata" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ulasan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinasiId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "komentar" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ulasan_destinasiId_fkey" FOREIGN KEY ("destinasiId") REFERENCES "Destinasi" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fasilitas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destinasiId" INTEGER NOT NULL,
    "namaFasilitas" TEXT NOT NULL,
    CONSTRAINT "Fasilitas_destinasiId_fkey" FOREIGN KEY ("destinasiId") REFERENCES "Destinasi" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
