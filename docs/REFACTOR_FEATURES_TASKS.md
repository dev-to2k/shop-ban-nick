# Refactor libs theo hướng 1: Vertical slice (mỗi feature = api + web)

**Mục tiêu:** Mỗi feature nằm trong một folder `libs/features/<name>/` với:
- `src/api/` – NestJS module, controller, service, DTO (cho apps/api)
- `src/web/` – React pages/components (cho apps/web)

**Path alias sau refactor:**
- `@shop-ban-nick/feature-auth` → web (pages login, register)
- `@shop-ban-nick/feature-auth/api` → api (AuthModule, …)
- Tương tự cho từng feature.

**Thứ tự làm:** Từ feature ít phụ thuộc → nhiều phụ thuộc. Làm xong một feature (build api + web pass) rồi mới chuyển feature tiếp theo.

---

## Chuẩn bị (làm 1 lần)

- [ ] Tạo cấu trúc thư mục mẫu cho 1 feature (auth) để làm template.
- [ ] Quy ước: mỗi feature có `libs/features/<name>/src/api/index.ts` và `libs/features/<name>/src/web/index.ts`; `project.json` + `tsconfig.json`/`tsconfig.lib.json` tương ứng.
- [ ] Cập nhật `tsconfig.base.json`: thêm path `@shop-ban-nick/feature-<name>` và `@shop-ban-nick/feature-<name>/api` khi tạo feature mới.

---

## Feature 1: Auth

**Nguồn hiện tại:** `libs/api-auth/` + `libs/features/auth/`.

**Tasks:**

1. [ ] Tạo `libs/features/auth/src/api/` và `libs/features/auth/src/web/`.
2. [ ] Di chuyển toàn bộ từ `libs/api-auth/src/lib/*` → `libs/features/auth/src/api/` (giữ cấu trúc: auth.controller, auth.module, auth.service, dto/, jwt*, roles.guard).
3. [ ] Tạo `libs/features/auth/src/api/index.ts` export AuthModule (và guard nếu cần).
4. [ ] Di chuyển từ `libs/features/auth/src/lib/*` → `libs/features/auth/src/web/` (login-page, register-page).
5. [ ] Tạo `libs/features/auth/src/web/index.ts` export LoginPage, RegisterPage.
6. [ ] Thêm/cập nhật `libs/features/auth/project.json`, `tsconfig.json`, `tsconfig.lib.json` (sourceRoot: `libs/features/auth/src`, có thể hai entry points api/web).
7. [ ] Cập nhật `tsconfig.base.json`: path `@shop-ban-nick/feature-auth` → `libs/features/auth/src/web/index.ts`, `@shop-ban-nick/feature-auth/api` → `libs/features/auth/src/api/index.ts`.
8. [ ] `apps/api/src/app/app.module.ts`: import AuthModule từ `@shop-ban-nick/feature-auth/api`.
9. [ ] `apps/web/app/login/page.tsx`, `register/page.tsx`: import từ `@shop-ban-nick/feature-auth`.
10. [ ] Xóa folder `libs/api-auth/`. Xóa code cũ trong `libs/features/auth/` (đã chuyển vào `src/web/`). Xóa path cũ `@shop-ban-nick/api-auth`, `@shop-ban-nick/features-auth` trong tsconfig.base.json.
11. [ ] Chạy `npm run build:api` và `npm run build:web` → pass.

---

## Feature 2: Order

**Nguồn hiện tại:** `libs/api-order/` + `libs/features/orders/` + checkout trong `libs/features/cart/` (CheckoutPage).

**Tasks:**

1. [ ] Tạo `libs/features/order/src/api/` và `libs/features/order/src/web/`.
2. [ ] Di chuyển từ `libs/api-order/src/lib/*` → `libs/features/order/src/api/`.
3. [ ] Tạo `libs/features/order/src/api/index.ts` export OrderModule, AdminOrderController (hoặc module export hết).
4. [ ] Di chuyển từ `libs/features/orders/src/lib/*` (orders-page, order-detail-page) → `libs/features/order/src/web/`.
5. [ ] Di chuyển CheckoutPage (và form checkout) từ `libs/features/cart/` → `libs/features/order/src/web/` (checkout thuộc order feature).
6. [ ] Tạo `libs/features/order/src/web/index.ts` export OrdersPage, OrderDetailPage, CheckoutPage.
7. [ ] Cập nhật project.json, tsconfig cho feature order. Thêm path `@shop-ban-nick/feature-order`, `@shop-ban-nick/feature-order/api`.
8. [ ] apps/api: import OrderModule từ `@shop-ban-nick/feature-order/api`.
9. [ ] apps/web: orders/*, checkout/page.tsx import từ `@shop-ban-nick/feature-order`. Cập nhật features/cart: bỏ export CheckoutPage (đã chuyển sang order).
10. [ ] shared-web api/order: giữ nguyên hoặc chỉ import type từ shared; không đổi gọi API.
11. [ ] Xóa `libs/api-order/`, dọn `libs/features/orders/` (đã chuyển). Xóa path cũ.
12. [ ] Build api + web → pass.

---

## Feature 3: Wallet

**Nguồn hiện tại:** `libs/api-wallet/` + wallet UI trong `libs/features/profile/` (ProfileWalletPage).

**Tasks:**

1. [ ] Tạo `libs/features/wallet/src/api/` và `libs/features/wallet/src/web/`.
2. [ ] Di chuyển từ `libs/api-wallet/src/lib/*` → `libs/features/wallet/src/api/`.
3. [ ] Tạo `libs/features/wallet/src/api/index.ts` export WalletModule.
4. [ ] Di chuyển ProfileWalletPage (và logic wallet) từ `libs/features/profile/` → `libs/features/wallet/src/web/`. Profile chỉ re-export hoặc import từ feature-wallet.
5. [ ] Tạo `libs/features/wallet/src/web/index.ts` export ProfileWalletPage (hoặc WalletPage nếu đổi tên).
6. [ ] Cập nhật project.json, tsconfig. Thêm path feature-wallet, feature-wallet/api.
7. [ ] apps/api: import WalletModule từ `@shop-ban-nick/feature-wallet/api`.
8. [ ] apps/web profile/wallet/page.tsx: import từ `@shop-ban-nick/feature-wallet`.
9. [ ] Xóa `libs/api-wallet/`. Cập nhật `libs/features/profile/` (bỏ wallet page, import từ feature-wallet). Xóa path cũ.
10. [ ] Build api + web → pass.

---

## Feature 4: Game

**Nguồn hiện tại:** `libs/api-game/` + `libs/features/catalog/` (GamesPage, GameAccountsPage) + `libs/features/admin/` (AdminGamesPage, AdminGameEditPage, AdminGameNewPage).

**Tasks:**

1. [ ] Tạo `libs/features/game/src/api/` và `libs/features/game/src/web/`.
2. [ ] Di chuyển từ `libs/api-game/src/lib/*` → `libs/features/game/src/api/`.
3. [ ] Tạo `libs/features/game/src/api/index.ts` export GameModule, AdminGameController.
4. [ ] Di chuyển GamesPage từ `libs/features/catalog/` → `libs/features/game/src/web/`. (GameAccountsPage, AccountDetailPage thuộc feature account, làm ở Feature 5.)
5. [ ] Di chuyển AdminGamesPage, AdminGameEditPage, AdminGameNewPage từ `libs/features/admin/` → `libs/features/game/src/web/`.
6. [ ] Tạo `libs/features/game/src/web/index.ts` export GamesPage, AdminGamesPage, AdminGameEditPage, AdminGameNewPage.
7. [ ] Cập nhật project.json, tsconfig. Thêm path feature-game, feature-game/api.
8. [ ] apps/api: import GameModule từ `@shop-ban-nick/feature-game/api`.
9. [ ] apps/web: games/* import từ `@shop-ban-nick/feature-game`; admin/games/* import từ `@shop-ban-nick/feature-game`. Cập nhật libs/features/admin: xóa game-related pages, re-export từ feature-game nếu cần.
10. [ ] shared-web api/game: giữ nguyên.
11. [ ] Xóa `libs/api-game/`. Dọn catalog (chỉ còn GameAccountsPage, AccountDetailPage → chuyển ở Feature 5 Account).
12. [ ] Build api + web → pass.

---

## Feature 5: Account

**Nguồn hiện tại:** `libs/api-account/` + `libs/features/catalog/` (AccountDetailPage, GameAccountsPage) + `libs/features/admin/` (AdminGameAccountsPage).

**Lưu ý:** GameAccountsPage = danh sách acc theo game; AccountDetailPage = chi tiết 1 acc; AdminGameAccountsPage = CRUD acc theo game. Cả ba đều thuộc “account” → gom vào feature account.

**Tasks:**

1. [ ] Tạo `libs/features/account/src/api/` và `libs/features/account/src/web/`.
2. [ ] Di chuyển từ `libs/api-account/src/lib/*` → `libs/features/account/src/api/`.
3. [ ] Tạo `libs/features/account/src/api/index.ts` export AccountModule, AdminAccountController.
4. [ ] Di chuyển AccountDetailPage, GameAccountsPage từ catalog và AdminGameAccountsPage từ admin → `libs/features/account/src/web/`.
5. [ ] Tạo `libs/features/account/src/web/index.ts` export AccountDetailPage, GameAccountsPage, AdminGameAccountsPage.
6. [ ] Cập nhật project.json, tsconfig. Thêm path feature-account, feature-account/api.
7. [ ] apps/api: import AccountModule từ `@shop-ban-nick/feature-account/api`.
8. [ ] apps/web: games/[slug]/page.tsx (GameAccountsPage), games/[slug]/[accountId]/page.tsx (AccountDetailPage), admin/games/[id]/accounts/page.tsx (AdminGameAccountsPage) import từ `@shop-ban-nick/feature-account`.
9. [ ] Xóa `libs/api-account/`. Cập nhật catalog (sau bước này catalog có thể trống → xóa hoặc giữ shell). Cập nhật admin (bỏ game-accounts page, import từ feature-account).
10. [ ] Build api + web → pass.

---

## Feature 6: Banner

**Nguồn hiện tại:** `libs/api-banner/`. Web: banner dùng trong shared-web (components) hoặc home.

**Tasks:**

1. [ ] Tạo `libs/features/banner/src/api/` và (tùy chọn) `libs/features/banner/src/web/` nếu có component UI riêng; không thì chỉ api.
2. [ ] Di chuyển từ `libs/api-banner/src/lib/*` → `libs/features/banner/src/api/`.
3. [ ] Tạo `libs/features/banner/src/api/index.ts` export BannerModule.
4. [ ] Nếu không có web riêng: chỉ cần path `@shop-ban-nick/feature-banner/api`. Apps/api import BannerModule từ đó.
5. [ ] Xóa `libs/api-banner/`, cập nhật path. Build api → pass.

---

## Feature 7: Upload

**Nguồn hiện tại:** `libs/api-upload/`. Chỉ API, dùng bởi admin.

**Tasks:**

1. [ ] Tạo `libs/features/upload/src/api/`.
2. [ ] Di chuyển từ `libs/api-upload/src/lib/*` → `libs/features/upload/src/api/`.
3. [ ] Tạo `libs/features/upload/src/api/index.ts` export UploadModule.
4. [ ] Cập nhật project.json, tsconfig. Thêm path `@shop-ban-nick/feature-upload/api`.
5. [ ] apps/api: import UploadModule từ `@shop-ban-nick/feature-upload/api`.
6. [ ] Xóa `libs/api-upload/`. Build api → pass.

---

## Feature 8: Cart (web only)

**Nguồn hiện tại:** `libs/features/cart/` (CartPage, CartClearDialog, CartRemoveItemDialog; CheckoutPage đã chuyển sang feature order).

**Tasks:**

1. [ ] Tạo `libs/features/cart/src/web/` (đã có sẵn cấu trúc features/cart, chỉ cần đưa vào chuẩn chung).
2. [ ] Đảm bảo cart chỉ còn CartPage và các dialog; CheckoutPage đã ở feature-order.
3. [ ] Đổi path từ `@shop-ban-nick/features-cart` → `@shop-ban-nick/feature-cart` (alias mới), trỏ vào `libs/features/cart/src/web/index.ts`.
4. [ ] apps/web cart/page.tsx: import từ `@shop-ban-nick/feature-cart`.
5. [ ] Build web → pass.

---

## Feature 9: Profile (web only)

**Nguồn hiện tại:** `libs/features/profile/` (ProfilePage, ProfileTransactionsPage; ProfileWalletPage đã chuyển sang feature-wallet).

**Tasks:**

1. [ ] Tạo `libs/features/profile/src/web/` (đã có). Profile chỉ còn ProfilePage, ProfileTransactionsPage; wallet import từ feature-wallet.
2. [ ] Đổi path từ `@shop-ban-nick/features-profile` → `@shop-ban-nick/feature-profile`.
3. [ ] apps/web profile/*: import từ `@shop-ban-nick/feature-profile` và `@shop-ban-nick/feature-wallet` (cho wallet page).
4. [ ] Build web → pass.

---

## Feature 10: Admin (web only)

**Nguồn hiện tại:** `libs/features/admin/` (AdminDashboardPage, AdminLayout, AdminOrdersPage; game/account pages đã chuyển sang feature-game, feature-account).

**Tasks:**

1. [ ] Sau khi đã chuyển game + account pages sang feature-game và feature-account, admin chỉ còn: AdminDashboardPage, AdminLayout, AdminOrdersPage.
2. [ ] Di chuyển 3 thứ trên vào `libs/features/admin/src/web/` (hoặc giữ cấu trúc hiện tại), export từ `libs/features/admin/src/web/index.ts`. Admin re-export từ feature-order (AdminOrdersPage có thể ở feature-order hoặc admin – nên AdminOrdersPage ở admin, gọi api order).
3. [ ] Đảm bảo AdminOrdersPage import từ feature-order (api/types), component đặt trong admin.
4. [ ] Đổi path từ `@shop-ban-nick/features-admin` → `@shop-ban-nick/feature-admin`.
5. [ ] apps/web admin/*: import từ `@shop-ban-nick/feature-admin`, `@shop-ban-nick/feature-game`, `@shop-ban-nick/feature-account` tùy trang.
6. [ ] Build web → pass.

---

## Dọn dẹp cuối

- [ ] Xóa hết folder lib cũ: `libs/api-*`, và các `libs/features/<name>/` cũ nếu đã chuyển hết vào cấu trúc mới (auth, orders, catalog khi đã rỗng).
- [ ] Xóa path cũ trong tsconfig.base.json: `api-auth`, `api-game`, … `features-auth`, `features-orders`, …
- [ ] Cập nhật shared-web (libs/shared/web): đảm bảo import từ feature-* đúng (api client vẫn có thể nằm shared-web, chỉ page/component dùng từ feature-*).
- [ ] Chạy full build + e2e (nếu có).

---

## Bảng path alias sau refactor (tsconfig.base.json)

| Alias | Trỏ tới |
|-------|--------|
| `@shop-ban-nick/feature-auth` | libs/features/auth/src/web/index.ts |
| `@shop-ban-nick/feature-auth/api` | libs/features/auth/src/api/index.ts |
| `@shop-ban-nick/feature-order` | libs/features/order/src/web/index.ts |
| `@shop-ban-nick/feature-order/api` | libs/features/order/src/api/index.ts |
| `@shop-ban-nick/feature-wallet` | libs/features/wallet/src/web/index.ts |
| `@shop-ban-nick/feature-wallet/api` | libs/features/wallet/src/api/index.ts |
| `@shop-ban-nick/feature-game` | libs/features/game/src/web/index.ts |
| `@shop-ban-nick/feature-game/api` | libs/features/game/src/api/index.ts |
| `@shop-ban-nick/feature-account` | libs/features/account/src/web/index.ts |
| `@shop-ban-nick/feature-account/api` | libs/features/account/src/api/index.ts |
| `@shop-ban-nick/feature-banner/api` | libs/features/banner/src/api/index.ts |
| `@shop-ban-nick/feature-upload/api` | libs/features/upload/src/api/index.ts |
| `@shop-ban-nick/feature-cart` | libs/features/cart/src/web/index.ts |
| `@shop-ban-nick/feature-profile` | libs/features/profile/src/web/index.ts |
| `@shop-ban-nick/feature-admin` | libs/features/admin/src/web/index.ts |

Giữ nguyên: `@shop-ban-nick/shared-web`, `@shop-ban-nick/shared-schemas`, `@shop-ban-nick/shared-types`, `@shop-ban-nick/nest-prisma`, `@shop-ban-nick/prisma-client`, `@shop-ban-nick/shared-utils`.
