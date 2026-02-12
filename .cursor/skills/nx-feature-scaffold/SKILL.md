---
name: nx-feature-scaffold
description: Scaffolds new features as NX libs in this monorepo with flat structure, context/hooks/components/services pattern. Use when the user asks to create a new feature, build a page/module (e.g. "làm trang blog", "build blog", "tạo feature X", "xây dựng module Y"), or add a feature-based lib.
---

# NX Feature Scaffold (Feature-Based Scaling)

Repeatable process to add a new feature as an NX lib. Fit: NX monorepo, apps/web flat; scale by generating feature libs with NX CLI then applying internal flat structure (context + hooks + components + services). Replace placeholder `blog` with the actual feature name.

## When to Apply

- User says: "làm trang X", "build X", "tạo feature X", "xây dựng module Y".
- New feature needs: list/detail pages, admin table/form, hooks, API service, optional context.

## Step 1: Planning

**Scope checklist:**

| Layer | Items (replace `blog` with feature name) |
|-------|------------------------------------------|
| Pages | XxxList, XxxDetail, AdminXxxTable, AdminXxxForm |
| Components | XxxCard, XxxEditor (if needed) |
| Hooks | useXxxList, useXxxDetail, useCreateXxx (mutations) |
| Service | xxxService.ts — getList, getBySlug/ById, create, update, delete |
| Validation/Types | xxxSchema.ts (Zod), xxxTypes.ts (interfaces) |
| Context | XxxContext.tsx only if feature needs shared state (e.g. draft); otherwise skip |

**Dependencies:** Feature lib depends only on `@shop-ban-nick/shared-*`. No feature-to-feature deps.

**Routes:** Plan routes in `apps/web/app/` (e.g. `/blog`, `/blog/[slug]`, `/admin/blog/*`).

**API:** Services use shared fetcher; backend: add Nest module in `apps/api` if needed.

**NX tags:** Add `scope:feature` (or `scope:feature-<name>`) in `project.json` for boundaries.

## Step 2: Generate Feature Lib (NX CLI)

From repo root (PowerShell):

```powershell
nx g @nx/react:lib features/<name> --bundler=vite --unitTestRunner=vitest --e2eTestRunner=none --no-interactive
```

Example for blog: `nx g @nx/react:lib features/blog ...` → `libs/features/<name>/`.

**After generate:**

1. **project.json** — ensure tags, e.g. `"tags": ["scope:feature", "type:ui"]`.
2. **tsconfig.base.json** — add path alias:
   - `"@shop-ban-nick/feature-<name>": ["libs/features/<name>/src/index.ts"]`
   - If API exists: `"@shop-ban-nick/feature-<name>/api": ["libs/features/<name>/src/api/index.ts"]`
3. **nx.json** (optional) — depConstraints so feature libs only depend on shared:
   - `{"sourceTag": "scope:feature", "onlyDependOnLibsWithTags": ["scope:shared"]}` (adjust tag names to match repo).

## Step 3: Internal Structure (Flat)

Prefer flat under `libs/features/<name>/src/`. Use subfolders only when >~10 files (e.g. `web/`, `api/`).

**Web-only feature (e.g. blog UI):**

```
libs/features/<name>/
├── src/
│   ├── XxxList.tsx
│   ├── XxxDetail.tsx
│   ├── AdminXxxTable.tsx
│   ├── AdminXxxForm.tsx
│   ├── XxxCard.tsx
│   ├── useXxxList.ts
│   ├── useXxxDetail.ts
│   ├── useCreateXxx.ts
│   ├── xxxService.ts
│   ├── xxxSchema.ts
│   ├── xxxTypes.ts
│   ├── XxxContext.tsx   // optional
│   └── index.ts
├── project.json
├── tsconfig.json
├── tsconfig.lib.json
└── README.md
```

**Feature with API (Nest):** add `src/api/` with `controller`, `service`, `module`, `dto`, and export from `api/index.ts`. Keep web in `src/web/` or flat under `src/` per existing libs (auth, game, order, etc.).

**Patterns:**

- **Components/Pages:** UI only; use Tailwind; import shared from `@shop-ban-nick/shared-web` (e.g. Button, Skeleton). Pages use hooks from same lib.
- **Hooks:** React Query (`@tanstack/react-query`); queryKey from shared if defined; queryFn calls service.
- **Service:** Plain async functions; use shared API fetcher (e.g. `fetcher('/api/...')`).
- **Context:** Only if feature needs shared state; otherwise rely on hooks + URL state.

**Barrel:** `index.ts` re-exports public API. Prefer named exports; no default unless required by routing.

## Step 4: Integrate into apps/web

- Add routes under `apps/web/app/`:
  - `app/<name>/page.tsx` → import list component from `@shop-ban-nick/feature-<name>`.
  - `app/<name>/[slug]/page.tsx` (or `[id]`) → detail.
  - `app/admin/<name>/page.tsx` (and optional new/edit) → admin table/form.
- Wrap with feature Provider in page or layout only if Context is used.
- Backend: `nx g @nx/nest:module <name> --project=api` (or add controller/service manually under existing API app).

## Step 5: Test & Scale

- Unit tests: `nx test <name>` (or project name NX assigned).
- Build: `nx build web`; dev: `nx dev web`.
- Use `nx graph` to check deps. When growing, split shared UI into libs and keep feature libs depending only on shared.

## Step 6: Reuse for Other Features

- Replace `<name>` and `Xxx` in commands, paths, and file names.
- If a feature grows (>~10 files), introduce `src/web/` and `src/api/` (or `src/lib/`) while keeping flat inside each.
- Commit in stages: generate → structure → integrate.

## Repo Conventions (This Project)

- Path aliases: `@shop-ban-nick/feature-<name>`, `@shop-ban-nick/feature-<name>/api`.
- Existing features (auth, game, order, account, wallet, banner, admin, cart, profile) use `api/` + `web/` or `lib/` under `libs/features/<name>/src/`. Prefer aligning new libs with this (e.g. `src/web/` for Next pages/components, `src/api/` for Nest).
- Tags in project.json: `scope:feature` (or more specific). Use same pattern for new libs.

For extended code samples (BlogList, useBlogList, blogService, BlogContext), see [reference.md](reference.md).
