# School Cashier Pro

Aplikasi kasir sekolah berbasis web yang profesional untuk mengelola pembayaran siswa.

## Fitur

- Dashboard Real-time
- Manajemen Data Siswa (CRUD)
- Modul Transaksi Pembayaran
- Laporan Keuangan
- Manajemen User & Role (Admin, Manager, Kasir)
- Autentikasi berbasis JWT

## Teknologi

- **Frontend:** React.js, TypeScript, Tailwind CSS, React Router, Recharts
- **Backend:** Node.js, Express.js
- **Database:** File JSON (untuk development)

---

## Panduan Setup & Instalasi

### Prasyarat

- Node.js (v18+)
- npm atau yarn

### 1. Clone Repository

```bash
git clone <url-repo-anda>
cd school-cashier-app
```

### 2. Setup Backend

> **Penting:** Semua perintah berikut dijalankan dari dalam direktori `/server`.

```bash
# Masuk ke direktori server
cd server

# Install dependencies
npm install

# Buat file .env dari contoh
# Ganti JWT_SECRET dengan kunci rahasia Anda sendiri
cp .env.example .env

# Jalankan server (mode development)
npm run dev
# Server akan berjalan di http://localhost:5000
```

### 3. Setup Frontend

> **Penting:** Semua perintah berikut dijalankan dari dalam direktori root proyek.

```bash
# Install dependencies
npm install

# Jalankan aplikasi React
npm run dev
# Aplikasi akan terbuka di http://localhost:3000
```

### 4. Kredensial Default

- **Admin:**
  - Username: `admin`
  - Password: `Admin@2024`
- **Manager:**
  - Username: `manager`
  - Password: `Manager@2024`
- **Kasir:**
  - Username: `kasir`
  - Password: `Kasir@2024`

---

## Struktur API Backend

### Autentikasi

- `POST /api/auth/login`: Login user dan dapatkan token JWT.
- `GET /api/auth/profile`: Dapatkan profil user yang sedang login (membutuhkan token).

### Siswa

- `GET /api/students`: Dapatkan semua siswa (mendukung query `search`, `kelas`).
- `GET /api/students/:id`: Dapatkan detail satu siswa.
- `POST /api/students`: Tambah siswa baru (Admin only).
- `PUT /api/students/:id`: Update data siswa (Admin only).
- `DELETE /api/students/:id`: Hapus siswa (Admin only).

### Transaksi

- `GET /api/transactions`: Dapatkan semua transaksi (mendukung filter query).
- `POST /api/transactions`: Buat transaksi baru (Admin & Kasir).

### Frontend:

Framework: React

Bahasa: TypeScript

Build Tool: Vite

Styling: Tailwind CSS

HTTP Client: Axios (untuk komunikasi dengan backend)

Grafik/Charting: Recharts

Ikon: Lucide React

### Backend:

Framework: Express.js (berjalan di atas Node.js)

Bahasa: JavaScript

API: REST API

Autentikasi: Menggunakan JWT (JSON Web Tokens) untuk mengamankan endpoint.

* Middleware:

  * CORS: Untuk mengizinkan permintaan
    dari domain yang berbeda (frontend).
  * Helmet: Untuk mengamankan aplikasi
    dengan mengatur header HTTP.
  * Morgan: Untuk logging permintaan HTTP.
  * BcryptJS: Untuk hashing kata sandi.
  * UUID: Untuk membuat ID unik.

  Database:

* Tipe: Anda menggunakan file JSON (db.json)
  sebagai database. Ini adalah pendekatan sederhana yang cocok untuk aplikasi
  skala kecil atau prototipe.
* Interaksi: Anda memiliki modul utilitas
  khusus (dbUtils.js) yang menggunakan modul fs (File System) bawaan Node.js
  untuk membaca dan menulis data ke

  file db.json.

  Singkatnya, Anda membangun aplikasi web
modern dengan tumpukan teknologi berbasis JavaScript/TypeScript, dengan React
di frontend, Node.js/Express di

  backend, dan file
JSON sederhana untuk penyimpanan data.
