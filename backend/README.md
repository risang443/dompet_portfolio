# Backend — Dompet API

Node.js + Express + Prisma + MySQL (via XAMPP)

## Setup

1. **Pastikan XAMPP MySQL nyala** (buka XAMPP Control Panel → Start MySQL)

2. **Buat database** lewat phpMyAdmin (`http://localhost/phpmyadmin`):
   - Buat database baru namanya `dompet`

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment variable**
   ```bash
   cp .env.example .env
   ```
   Cek `.env`, defaultnya sudah cocok untuk XAMPP (`root`, password kosong, port `3306`).

5. **Generate Prisma Client & migrate database**
   ```bash
   npx prisma migrate dev --name init
   ```
   Perintah ini otomatis bikin tabel `users` dan `transaksi` di database `dompet`.

6. **Jalankan server**
   ```bash
   npm run dev
   ```
   Server jalan di `http://localhost:8000`

## Cek database via GUI (opsional)

```bash
npx prisma studio
```
Buka GUI seperti phpMyAdmin tapi dari Prisma, di `http://localhost:5555`

## API Endpoints

| Method | Endpoint            | Auth | Keterangan              |
|--------|----------------------|------|--------------------------|
| POST   | /api/auth/register   | ❌   | Daftar akun baru         |
| POST   | /api/auth/login      | ❌   | Login, dapat token       |
| GET    | /api/auth/me         | ✅   | Data user yang login     |
| GET    | /api/transaksi       | ✅   | List transaksi           |
| POST   | /api/transaksi       | ✅   | Tambah transaksi         |
| DELETE | /api/transaksi/:id   | ✅   | Hapus transaksi          |

✅ = wajib kirim header `Authorization: Bearer <token>`
