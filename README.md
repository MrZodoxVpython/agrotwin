# ASEAN AgroTwin

Sesuai arsitektur: Pengguna (Petani, Koperasi, Administrator) → Frontend React.js → Nginx + HTTPS → Backend Node.js + Express.js
→ Digital Twin dan Simulation Engine → Layanan AI dan Prediction → PostgreSQL.

| Komponen | Lokasi |
|---|---|
| Frontend (React, Recharts, Leaflet) | `frontend/` |
| Nginx reverse proxy + HTTPS | `nginx/nginx.conf` |
| REST API, JWT, peran, validasi (zod) | `backend/src/index.js`, `auth.js` |
| Digital Twin dan Simulation Engine | `backend/src/twin.js` |
| Layanan AI (API analitik opsional, cadangan regresi) | `backend/src/ai.js` |
| Skema PostgreSQL (Prisma) | `backend/prisma/schema.prisma` |

## Menjalankan dengan Docker
```bash
cp .env.example .env            # isi POSTGRES_PASSWORD dan JWT_SECRET
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/CN=localhost" \
  -keyout nginx/certs/privkey.pem -out nginx/certs/fullchain.pem   # sertifikat uji; produksi: Let's Encrypt
docker compose up --build -d
docker compose exec backend npm run seed   # data contoh
```
Buka https://localhost. Akun contoh (kata sandi `password123`): `admin@agrotwin.id`, `koperasi@agrotwin.id`, `petani@agrotwin.id`.

## Pengembangan lokal
Backend: `cd backend && npm i && npx prisma db push && npm run seed && npm run dev` (butuh `DATABASE_URL` dan `JWT_SECRET`).
Frontend: `cd frontend && npm i && npm run dev` (proxy `/api` ke localhost:4000).

## Catatan
- PostgreSQL tidak membuka port ke luar; hanya backend yang mengaksesnya.
- Petani hanya melihat dan mengisi data koperasinya; simulasi, peta, dan prediksi untuk Koperasi dan Admin.
- Model simulasi dan prediksi masih sederhana. Isi `ANALYTICS_URL` untuk menyambungkan model Python (`POST /predict` menerima `{series, steps}` dan mengembalikan `{prakiraan:[...]}`).
- Data cuaca, harga, dan energi eksternal belum terintegrasi otomatis; saat ini dimasukkan lewat endpoint `/api/harga`.
