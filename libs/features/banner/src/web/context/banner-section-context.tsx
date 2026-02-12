'use client';

import { createContext } from 'react';
import type { BannerSectionContextValue } from '../types';

export const BannerSectionContext = createContext<BannerSectionContextValue | null>(null);
