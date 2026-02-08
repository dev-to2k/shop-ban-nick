import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shop-ban-nick/nest-prisma';
import { Prisma } from '@prisma/client';
import { getPaymentAdapter } from './adapters';

const DEFAULT_PROVIDER = 'DEMO';
const MAX_AMOUNT = 100_000_000;

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    if (!user) return { balance: 0 };
    return { balance: Number(user.walletBalance) };
  }

  async getWallet(userId: string, lastN = 5) {
    const [user, transactions] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      }),
      this.prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: lastN,
      }),
    ]);
    const balance = user ? Number(user.walletBalance) : 0;
    const list = transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      amount: Number(t.amount),
      type: t.type,
      referenceId: t.referenceId,
      createdAt: t.createdAt.toISOString(),
    }));
    return { balance, transactions: list };
  }

  async getTransactions(userId: string, query: { page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 50);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.walletTransaction.count({ where: { userId } }),
    ]);

    return {
      data: data.map((t) => ({
        id: t.id,
        userId: t.userId,
        amount: Number(t.amount),
        type: t.type,
        referenceId: t.referenceId,
        createdAt: t.createdAt.toISOString(),
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async createDepositRequest(
    userId: string,
    amount: number,
    provider: string = DEFAULT_PROVIDER,
    returnUrl?: string,
    cancelUrl?: string
  ) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');
    if (amount > MAX_AMOUNT) throw new BadRequestException(`Amount must not exceed ${MAX_AMOUNT}`);

    const providerKey = provider.toUpperCase();
    const adapter = getPaymentAdapter(providerKey);

    const request = await this.prisma.depositRequest.create({
      data: {
        userId,
        amount: new Prisma.Decimal(amount),
        provider: providerKey as any,
        status: 'PENDING',
      },
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const result = await adapter.createPaymentUrl({
      requestId: request.id,
      amount,
      userId,
      returnUrl: returnUrl || `${baseUrl}/profile/wallet?success=1`,
      cancelUrl: cancelUrl || `${baseUrl}/profile/wallet?cancel=1`,
    });

    if (result) {
      await this.prisma.depositRequest.update({
        where: { id: request.id },
        data: { paymentUrl: result.paymentUrl, externalId: result.externalId },
      });
    }

    const updated = await this.prisma.depositRequest.findUnique({
      where: { id: request.id },
    });

    return {
      requestId: updated!.id,
      amount,
      provider: updated!.provider,
      status: updated!.status,
      paymentUrl: updated!.paymentUrl ?? null,
      createdAt: updated!.createdAt.toISOString(),
    };
  }

  async getDepositRequest(requestId: string, userId: string) {
    const req = await this.prisma.depositRequest.findFirst({
      where: { id: requestId, userId },
    });
    if (!req) throw new NotFoundException('Deposit request not found');
    return {
      id: req.id,
      amount: Number(req.amount),
      provider: req.provider,
      status: req.status,
      paymentUrl: req.paymentUrl ?? null,
      createdAt: req.createdAt.toISOString(),
      completedAt: req.completedAt?.toISOString() ?? null,
    };
  }

  async confirmDepositRequest(requestId: string, userId: string) {
    const req = await this.prisma.depositRequest.findFirst({
      where: { id: requestId, userId },
    });
    if (!req) throw new NotFoundException('Deposit request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Request already processed');
    if (req.provider !== 'DEMO') throw new BadRequestException('Confirm only allowed for DEMO provider');

    const amount = Number(req.amount);
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.depositRequest.update({
        where: { id: requestId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { increment: amount } },
        select: { walletBalance: true },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          userId,
          amount: new Prisma.Decimal(amount),
          type: 'DEPOSIT',
          depositRequestId: requestId,
        },
      });

      return { user, txRecord };
    });

    return {
      balance: Number(result.user.walletBalance),
      transaction: {
        id: result.txRecord.id,
        userId: result.txRecord.userId,
        amount: Number(result.txRecord.amount),
        type: result.txRecord.type,
        referenceId: result.txRecord.referenceId,
        createdAt: result.txRecord.createdAt.toISOString(),
      },
    };
  }
}
