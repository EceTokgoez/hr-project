# İzin Yönetim Sistemi

Personelin izin talebi oluşturup yöneticisinin onayına/reddine sunduğu basit bir İK uygulaması.

## Teknolojiler

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT, bcrypt
- **Database:** PostgreSQL (Supabase)

## Kurulum

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # DATABASE_URL ve JWT_SECRET değerlerini doldur
npx prisma migrate dev
npx prisma db seed
npm run dev             # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL değerini doldur
npm run dev              # http://localhost:5173
```

## Test Kullanıcıları

| Rol      | E-posta            | Şifre  |
| -------- | ------------------- | ------ |
| Manager  | manager@test.com    | 123456 |
| Employee | employee@test.com   | 123456 |

## Deploy

- **Frontend → Vercel:** `frontend/` klasörünü proje kökü olarak seç, `VITE_API_URL` env değişkenini backend'in yayındaki URL'i ile ayarla. `vercel.json` SPA route'ları için gerekli rewrite kuralını içerir.
- **Backend → Render:** `backend/render.yaml` referans alınabilir. `DATABASE_URL` ve `JWT_SECRET` env değişkenlerini Render panelinden gir. Deploy sırasında `prisma migrate deploy` otomatik çalışır.
- **Database → Supabase:** Prisma migration'ları doğrudan Supabase Postgres'e uygulanır, ekstra bir adım gerekmez.