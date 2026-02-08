import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async findByGame(
    gameSlug: string,
    query: {
      page?: number;
      limit?: number;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      search?: string;
    }
  ) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const game = await this.prisma.game.findUnique({ where: { slug: gameSlug } });
    if (!game) throw new NotFoundException('Game not found');

    const where: Prisma.GameAccountWhereInput = {
      gameId: game.id,
      status: 'AVAILABLE',
      ...(query.minPrice || query.maxPrice
        ? { price: { ...(query.minPrice ? { gte: query.minPrice } : {}), ...(query.maxPrice ? { lte: query.maxPrice } : {}) } }
        : {}),
      ...(query.search ? { title: { contains: query.search, mode: 'insensitive' as const } } : {}),
    };

    const orderBy: Prisma.GameAccountOrderByWithRelationInput = {
      [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
    };

    const [data, total] = await Promise.all([
      this.prisma.gameAccount.findMany({ where, orderBy, skip, take: limit, include: { game: true } }),
      this.prisma.gameAccount.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const account = await this.prisma.gameAccount.findUnique({
      where: { id },
      include: { game: { include: { attributes: true } } },
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async create(data: {
    code: string;
    gameId: string;
    title: string;
    description?: string;
    price: number;
    images?: string[];
    attributes?: any;
    loginInfo?: string;
  }) {
    return this.prisma.gameAccount.create({
      data: {
        ...data,
        price: new Prisma.Decimal(data.price),
        images: data.images || [],
      },
      include: { game: true },
    });
  }

  async createBulk(accounts: {
    code: string;
    gameId: string;
    title: string;
    description?: string;
    price: number;
    images?: string[];
    attributes?: any;
    loginInfo?: string;
  }[]) {
    return this.prisma.gameAccount.createMany({
      data: accounts.map((a) => ({
        ...a,
        price: new Prisma.Decimal(a.price),
        images: a.images || [],
      })),
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      images?: string[];
      attributes?: any;
      status?: 'AVAILABLE' | 'SOLD' | 'RESERVED' | 'HIDDEN';
      loginInfo?: string;
    }
  ) {
    await this.findById(id);
    return this.prisma.gameAccount.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? new Prisma.Decimal(data.price) : undefined,
      },
      include: { game: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.gameAccount.delete({ where: { id } });
  }

  async findAllByGame(gameId: string, query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.GameAccountWhereInput = {
      gameId,
      ...(query.status ? { status: query.status as any } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.gameAccount.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.gameAccount.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
