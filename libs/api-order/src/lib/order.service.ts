import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@shop-ban-nick/nest-prisma';
import { Prisma } from '@prisma/client';
import type { PaymentMethod as PrismaPaymentMethod } from '@prisma/client';
import { PaymentMethod, OrderStatus } from '@shop-ban-nick/shared-types';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: { accountIds: string[]; paymentMethod: 'WALLET'; note?: string }) {
    const accounts = await this.prisma.gameAccount.findMany({
      where: { id: { in: dto.accountIds }, status: 'AVAILABLE' },
    });

    if (accounts.length !== dto.accountIds.length) {
      throw new BadRequestException('Some accounts are no longer available');
    }

    const totalAmount = accounts.reduce((sum, a) => sum.add(a.price), new Prisma.Decimal(0));
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    const balance = user ? Number(user.walletBalance) : 0;
    const total = Number(totalAmount);
    if (balance < total) {
      throw new BadRequestException({ code: 'INSUFFICIENT_BALANCE', required: total, current: balance });
    }

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          paymentMethod: PaymentMethod.WALLET as PrismaPaymentMethod,
          note: dto.note,
        },
        include: { accounts: true },
      });

      await tx.gameAccount.updateMany({
        where: { id: { in: dto.accountIds } },
        data: { status: 'RESERVED', orderId: order.id },
      });

      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: totalAmount } },
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          amount: new Prisma.Decimal(-total),
          type: 'PAYMENT',
          referenceId: order.id,
        },
      });

      return this.findById(order.id);
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { accounts: { include: { game: true } }, user: { select: { id: true, email: true, name: true, phone: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByUser(userId: string, query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: { accounts: { include: { game: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findAll(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where = query.status ? { status: query.status as any } : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: { accounts: { include: { game: true } }, user: { select: { id: true, email: true, name: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findById(id);

    if (status === 'CANCELLED' || status === 'REFUNDED') {
      await this.prisma.gameAccount.updateMany({
        where: { orderId: id },
        data: { status: 'AVAILABLE', orderId: null },
      });
    }

    if (status === 'COMPLETED') {
      await this.prisma.gameAccount.updateMany({
        where: { orderId: id },
        data: { status: 'SOLD' },
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { accounts: { include: { game: true } }, user: { select: { id: true, email: true, name: true, phone: true } } },
    });
  }

  async uploadPaymentProof(id: string, userId: string, paymentProof: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { paymentProof },
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalAccounts, availableAccounts, totalOrders, ordersToday, revenue] = await Promise.all([
      this.prisma.gameAccount.count(),
      this.prisma.gameAccount.count({ where: { status: 'AVAILABLE' } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    ]);

    return {
      totalAccounts,
      availableAccounts,
      totalOrders,
      ordersToday,
      revenue: revenue._sum.totalAmount || 0,
    };
  }
}
