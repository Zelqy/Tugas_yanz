# Yanz_Project - API Penyewaan Kendaraan

Stack: Express + Prisma (SQLite) + Apollo Server (GraphQL) + TypeScript (tsx).
NIM suffix yang dipakai di semua data: **011**.

## Jalankan

    npm install
    npm run db:push     # bikin prisma/dev.db sesuai schema
    npm run seed        # isi data contoh (nama customer + plat nomor memuat 011)
    npm start           # server mode normal di http://localhost:3000
    npm run start:dev   # server mode watch (auto restart tiap file diubah)

Cek cepat semua endpoint: `npm run smoke`.

## Alamat

| Halaman | URL | Keterangan |
| --- | --- | --- |
| REST API | http://localhost:3000/api/rentals | CRUD penyewaan |
| Apollo Sandbox | http://localhost:3000/graphql | IDE GraphQL resmi Apollo |
| Playground lokal | http://localhost:3000/playground | IDE ringan, same-origin, tanpa izin browser |

Catatan CORS: server sudah mengirim header CORS (`Access-Control-Allow-Origin: *`) dan menjawab preflight
`OPTIONS` dengan 204, sehingga Apollo Sandbox dapat memanggil endpoint ini dari domain lain.

Catatan browser: karena Sandbox berjalan di iframe HTTPS dan endpoint-nya di localhost, Chrome meminta izin
"akses perangkat di jaringan lokal" sekali. Klik **Allow**. Kalau tidak ingin berurusan dengan izin tersebut,
pakai **http://localhost:3000/playground** yang berjalan pada origin yang sama.

## 1. Endpoint REST + DTO

| Method | URI | Fungsi |
| --- | --- | --- |
| POST | /api/rentals | buat rental (sekaligus buat transaksi) |
| PUT | /api/rentals/:id | update rental |
| GET | /api/rentals | list rental + relasi customer dan vehicle |
| GET | /api/transactions/:id | ambil transaksi + customer + rental |

File DTO: `src/dto.ts` (`CreateRentalDto`, `UpdateRentalDto`, `validateCreateRental`, `validateUpdateRental`).

Aturan validasi (semua error dikumpulkan sekaligus, response 400):

- `customerName` wajib, panjang 3 sampai 50 karakter
- `vehiclePlate` wajib, panjang 4 sampai 12 karakter
- `rentalDate` wajib format ISO-8601, contoh `2026-11-01T08:00:00.000Z`
- `endDate` opsional, ISO-8601, harus setelah `rentalDate`
- `totalCost` wajib angka dan tidak boleh negatif
- `amount` wajib angka dan harus lebih besar dari 0
- `method` opsional, panjang 3 sampai 20 karakter

Contoh:

    curl -X POST http://localhost:3000/api/rentals -H "Content-Type: application/json" -d "{\"customerName\":\"Yanz Pratama 011\",\"customerEmail\":\"yanz.011@example.com\",\"vehiclePlate\":\"B 1011 YZ\",\"rentalDate\":\"2026-11-06T09:00:00.000Z\",\"endDate\":\"2026-11-09T09:00:00.000Z\",\"totalCost\":450000,\"amount\":450000,\"method\":\"transfer\"}"

## 2. Model Prisma + relasi

File: `prisma/schema.prisma` (datasource SQLite, jadi tidak perlu server database).

- **Customer** 1 - N **Rental**
- **Customer** 1 - N **Transaction**
- **Vehicle** 1 - N **Rental**
- **Rental** 1 - N **Transaction**

Field `totalCost` memakai tipe Float, `rentalDate`/`endDate`/`createdAt` memakai DateTime.

## 3. Service + bukti jalan

File: `src/penyewaan.service.ts`

- `getTransactionById(id)` -> transaksi beserta `customer` dan `rental` (termasuk `vehicle`)
- `getRentalById(id)`, `listRentals()`, `listTransactions()`, `createRental()`, `updateRental()`

Bukti response: `docs/screenshots/03-rest-rentals.png` (response GET /api/rentals, sudah memuat 011).

## 4. Query GraphQL + Apollo Sandbox

Buka **http://localhost:3000/graphql** (Apollo Sandbox otomatis terbuka), tempel query ini lalu Run:

    query DataPenyewaan {
      rental(id: 1) {
        rentalDate
        totalCost
        customer {
          name
        }
        vehicle {
          brand
        }
      }
    }

Hasil nyata di mesin ini:

    {"data":{"rental":{"rentalDate":"2026-11-01T08:00:00.000Z","totalCost":800000,"customer":{"name":"Rina Wijaya 011"},"vehicle":{"brand":"Honda"}}}}

Query tambahan untuk membuktikan service + relasi berlapis:

    query {
      transaction(id: 1) {
        id
        amount
        method
        customer {
          name
        }
        rental {
          rentalDate
          totalCost
          vehicle {
            brand
            plate
          }
        }
      }
    }

Catatan: screenshot Apollo Sandbox harus diambil dari browser asli (buka URL di atas), karena halaman Sandbox merender lewat JavaScript sehingga tidak bisa di-capture otomatis dari sini.
