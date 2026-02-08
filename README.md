# ShopAcc - Web Bán Acc Game

Nx monorepo MVP cho web bán acc game. Next.js 16 + NestJS 11 + PostgreSQL + Prisma 6 + shadcn/ui.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack) + shadcn/ui + Zustand 5
- **Backend**: NestJS 11 (REST API) + Passport JWT
- **Database**: PostgreSQL 18 + Prisma 6
- **Monorepo**: Nx 22
- **Styling**: TailwindCSS 4 (via shadcn/ui)

## Cấu trúc

```
apps/web/          - Next.js frontend
apps/api/          - NestJS backend API
libs/shared/types/ - Shared TypeScript types/DTOs
libs/shared/utils/ - Shared utilities
libs/prisma-client/- Prisma schema & client
```

## Bắt đầu

### 1. Khởi động PostgreSQL

```bash
docker-compose up -d
```

### 2. Chạy migration & seed

```bash
npm run db:migrate
npm run db:seed
```

### 3. Chạy dev servers

```bash
# Terminal 1 - API (port 3001)
npm run dev:api

# Terminal 2 - Web (port 4200)
npm run dev:web
```

### 4. Truy cập

- Web: http://localhost:4200
- API: http://localhost:3001
- pgAdmin: http://localhost:5050 (admin@admin.com / admin)
- Prisma Studio: `npm run db:studio`

## Tài khoản test

- **Admin**: admin@shopnick.vn / admin123
- **Sample data**: 3 games (Liên Quân, Free Fire, Genshin) + 7 acc mẫu

## API Endpoints

### Public
- `GET /api/games` - Danh sách game
- `GET /api/games/:slug` - Chi tiết game
- `GET /api/games/:slug/accounts` - Acc theo game (filter, sort, pagination)
- `GET /api/accounts/:id` - Chi tiết acc
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Authenticated
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/my` - Đơn hàng của tôi
- `POST /api/upload` - Upload ảnh

### Admin
- `CRUD /api/admin/games` - Quản lý game
- `CRUD /api/admin/accounts` - Quản lý acc
- `GET /api/admin/orders` - Danh sách đơn
- `PUT /api/admin/orders/:id/status` - Cập nhật trạng thái đơn
- `GET /api/admin/orders/stats` - Thống kê

## Deploy (Vercel – frontend only)

Build chạy từ **repo root** (cấu hình trong `vercel.json` ở root).

### CLI (từ repo root)

```powershell
npm run vercel:link    # lần đầu: link project
npm run vercel:deploy   # preview
npm run vercel:prod    # production
```

**Trên Vercel Dashboard:** Root Directory = `.` (để trống hoặc repo root). Env: Project → Settings → Environment Variables.

### Dashboard

1. [Import repo](https://vercel.com/new) → chọn repo.
2. **Root Directory**: để trống (repo root).
3. Build / Install lấy từ `vercel.json` (root).
4. **Environment Variables**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, …
5. API (NestJS) host riêng.
