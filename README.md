# 💰 Dompet — Personal Finance Tracker

> Full-stack personal finance app — React di frontend, Node.js di backend

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-XAMPP-4479A1?style=flat&logo=mysql)

## ✨ Fitur

- 🔐 Autentikasi (Register / Login dengan JWT)
- 📊 Dashboard dengan grafik tren keuangan
- 📋 CRUD Transaksi (pemasukan & pengeluaran)
- 🎯 Anggaran per kategori *(coming soon)*
- 📱 Responsive design

## 🛠 Tech Stack

| Layer     | Tools                                  |
|-----------|------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Zustand    |
| Routing   | React Router v6                          |
| Charts    | Recharts                                 |
| Backend   | Node.js, Express, JWT                    |
| ORM       | Prisma                                   |
| Database  | MySQL (XAMPP)                            |

## 📁 Struktur Project

```
dompet/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/      # Zustand state
│       └── services/   # API calls
│
└── backend/            # Express API
    ├── prisma/
    │   └── schema.prisma   # Database schema
    └── src/
        ├── controllers/
        ├── routes/
        └── middleware/
```

## 🚀 Cara Menjalankan

Butuh **2 terminal** berjalan bersamaan.

### 1️⃣ Backend (jalankan dulu)
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```
→ Jalan di `http://localhost:8000`

### 2️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```
→ Jalan di `http://localhost:5173`

> **Penting:** Pastikan XAMPP MySQL sudah running sebelum start backend. Detail lengkap ada di [`backend/README.md`](./backend/README.md).

## 🔗 Bagaimana Frontend & Backend Terhubung

```
React (5173) → axios request ke /api/...
            → Vite proxy ke → http://localhost:8000 (Express)
                            → Prisma → MySQL (XAMPP)
```

Konfigurasi proxy ada di `frontend/vite.config.js`, jadi dari sisi React kamu cukup panggil `/api/...` tanpa perlu sebut `localhost:8000` setiap saat.

---

Made with ☕ by [Nicholaus Risang](https://github.com/risang443)
