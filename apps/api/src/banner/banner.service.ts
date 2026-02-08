import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface BannerItem {
  image: string;
  title: string;
  subtitle: string;
  href: string;
  gradient: string;
  promo?: boolean;
}

@Injectable()
export class BannerService {
  /** Đọc từ apps/api/assets/banners/config.json, return paths /assets/banners/<file>. */
  findAll(): BannerItem[] {
    const base = process.env.ASSETS_PATH || join(process.cwd(), 'apps', 'api', 'assets');
    const configPath = join(base, 'banners', 'config.json');
    try {
      const raw = readFileSync(configPath, 'utf-8');
      const items = JSON.parse(raw) as BannerItem[];
      return items.map((item) => ({
        ...item,
        image: item.image.startsWith('/') ? item.image : `/assets/banners/${item.image}`,
      }));
    } catch {
      return [];
    }
  }
}
