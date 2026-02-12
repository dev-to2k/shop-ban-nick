'use client';

import { createContext } from 'react';
import type { GamesSectionContextValue } from '../types';

export const GamesSectionContext = createContext<GamesSectionContextValue | null>(null);
