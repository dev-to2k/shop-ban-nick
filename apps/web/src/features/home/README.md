# Home sections – structure (Context + Section + components)

Áp dụng cùng pattern với BannerSection / GamesSection:

- **context/** – React Context cho section (data + state).
- **hooks/** – `useXxxSection()` consume context.
- **store/** – (optional) Zustand khi cần state dùng ngoài section.
- **components/** – Section container + con (Content, Loading, Error).

## Đã có

- **HeroSection** – context `accLabel`, wrapper `HomeHero`.
- **TrustBadgesSection** – context `sectionVariant`, wrapper `TrustBadges`.

## Thêm section mới (FlashSale, Products, Faq, …)

1. Tạo thư mục `flash-sale/` (hoặc tên section).
2. Thêm `context.tsx` (Context + type value).
3. Thêm `use-flash-sale-section.ts` (useContext).
4. Thêm `flash-sale-section.tsx` (Provider + React Query nếu có data + render Loading/Error/Content).
5. Thêm components con: `flash-sale-content.tsx`, `flash-sale-loading.tsx`, `flash-sale-error.tsx` nếu cần.
6. Export trong `index.ts`.

Data: dùng React Query trong section container, đưa vào Context để component con dùng qua `useXxxSection()`.
