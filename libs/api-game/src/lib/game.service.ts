import { Injectable, NotFoundException } from '@nestjs/common';
import { readdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '@shop-ban-nick/nest-prisma';
import { Prisma } from '@prisma/client';

const EXT = ['.png', '.jpg', '.jpeg', '.webp'];

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  private getThumbnailsDir(): string {
    const base = process.env.ASSETS_PATH || join(process.cwd(), 'apps', 'api', 'assets');
    return join(base, 'games');
  }

  private getThumbnailMap(): Record<string, string> {
    const dir = this.getThumbnailsDir();
    const out: Record<string, string> = {};
    try {
      for (const name of readdirSync(dir)) {
        const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
        if (!EXT.includes(ext)) continue;
        const slug = name.slice(0, name.lastIndexOf('.'));
        out[slug] = `/assets/games/${name}`;
      }
    } catch {
      // ignore
    }
    return out;
  }

  async findAll(activeOnly = true) {
    const where: Prisma.GameWhereInput = activeOnly ? { isActive: true } : {};
    const games = await this.prisma.game.findMany({
      where,
      include: { attributes: true, _count: { select: { accounts: { where: { status: 'AVAILABLE' } } } } },
      orderBy: { createdAt: 'desc' },
    });
    const thumbs = this.getThumbnailMap();
    return games.map((g) => ({
      ...g,
      thumbnail: thumbs[g.slug] ?? g.thumbnail,
    }));
  }

  async findBySlug(slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: { attributes: true, _count: { select: { accounts: { where: { status: 'AVAILABLE' } } } } },
    });
    if (!game) throw new NotFoundException('Game not found');
    const thumbs = this.getThumbnailMap();
    return { ...game, thumbnail: thumbs[game.slug] ?? game.thumbnail };
  }

  async findById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { attributes: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    const thumbs = this.getThumbnailMap();
    return { ...game, thumbnail: thumbs[game.slug] ?? game.thumbnail };
  }

  async create(data: {
    name: string;
    slug: string;
    thumbnail?: string;
    description?: string;
    attributes?: { name: string; type: 'TEXT' | 'NUMBER' | 'SELECT'; options?: any }[];
  }) {
    return this.prisma.game.create({
      data: {
        name: data.name,
        slug: data.slug,
        thumbnail: data.thumbnail,
        description: data.description,
        attributes: data.attributes
          ? { create: data.attributes.map((a) => ({ name: a.name, type: a.type, options: a.options })) }
          : undefined,
      },
      include: { attributes: true },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      thumbnail?: string;
      description?: string;
      isActive?: boolean;
      attributes?: { name: string; type: 'TEXT' | 'NUMBER' | 'SELECT'; options?: any }[];
    }
  ) {
    await this.findById(id);

    if (data.attributes) {
      await this.prisma.gameAttribute.deleteMany({ where: { gameId: id } });
    }

    return this.prisma.game.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        thumbnail: data.thumbnail,
        description: data.description,
        isActive: data.isActive,
        attributes: data.attributes
          ? { create: data.attributes.map((a) => ({ name: a.name, type: a.type, options: a.options })) }
          : undefined,
      },
      include: { attributes: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.game.delete({ where: { id } });
  }
}
