import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    const where: Prisma.GameWhereInput = activeOnly ? { isActive: true } : {};
    return this.prisma.game.findMany({
      where,
      include: { attributes: true, _count: { select: { accounts: { where: { status: 'AVAILABLE' } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: { attributes: true, _count: { select: { accounts: { where: { status: 'AVAILABLE' } } } } },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async findById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { attributes: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
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
