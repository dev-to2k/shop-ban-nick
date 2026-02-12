# Banner feature (web)

## Structure

- **context/** – `BannerSectionContext`: provides banners, loading, error, refetch, activeIndex, emblaApi to the section tree.
- **store/** – Zustand `useBannerStore`: global UI state (activeIndex, isPaused) for use outside the section.
- **hooks/** – `useBannersQuery` (React Query), `useBannerSection` (context consumer).
- **components/** – `BannerSection` (container + provider), `BannerTrack`, `BannerSlideItem`, `BannerLoading`, `BannerError`, `BannerNav`, `BannerDots`.
- **types.ts** – `BannerSlide`, `BannerSectionContextValue`.

## Data flow

1. **React Query** – `useBannersQuery()` fetches from API; source of truth for server state.
2. **Context** – `BannerSection` provides list, loading, error, refetch, activeIndex, emblaApi so children avoid prop drilling.
3. **Zustand** – `useBannerStore()` for activeIndex/isPaused when needed outside the section (e.g. pause when modal opens).

## Usage

```tsx
import { BannerSection } from '@shop-ban-nick/feature-banner';

<BannerSection />
```

To extend: add new components under `components/`, consume via `useBannerSection()` or `useBannerStore()`.
