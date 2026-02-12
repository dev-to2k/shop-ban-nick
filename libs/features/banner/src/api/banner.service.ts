import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shop-ban-nick/nest-prisma';

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
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<BannerItem[]> {
    const rows = await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((row) => ({
      image: row.image.startsWith('/') ? row.image : `/assets/banners/${row.image}`,
      title: row.title,
      subtitle: row.subtitle,
      href: row.href,
      gradient: row.gradient,
      promo: row.promo,
    }));
  }
}
