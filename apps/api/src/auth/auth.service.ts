import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@shop-ban-nick/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(dto: { email: string; password: string; name: string; phone?: string }) {
    const [existingEmail, existingPhone] = await Promise.all([
      this.prisma.user.findUnique({ where: { email: dto.email } }),
      dto.phone?.trim() ? this.prisma.user.findUnique({ where: { phone: dto.phone.trim() } }) : Promise.resolve(null),
    ]);
    if (existingEmail) throw new ConflictException({ errors: [{ field: 'email', message: 'Email đã được sử dụng' }] });
    if (existingPhone) throw new ConflictException({ errors: [{ field: 'phone', message: 'Số điện thoại đã được sử dụng' }] });

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, ...(dto.phone?.trim() && { phone: dto.phone.trim() }), password: hash },
    });

    return this.signToken(user.id, user.email, user.role as Role);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.signToken(user.id, user.email, user.role as Role);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, name: true, avatar: true, role: true, walletBalance: true, createdAt: true, updatedAt: true },
    });
    if (!user) return null;
    return { ...user, walletBalance: Number(user.walletBalance) };
  }

  async updateProfile(userId: string, dto: { name?: string; phone?: string; avatar?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.phone != null && { phone: dto.phone }),
        ...(dto.avatar != null && { avatar: dto.avatar }),
      },
      select: { id: true, email: true, phone: true, name: true, avatar: true, role: true, walletBalance: true, createdAt: true, updatedAt: true },
    });
    return { ...user, walletBalance: Number(user.walletBalance) };
  }

  private async signToken(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwt.signAsync(payload);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, name: true, avatar: true, role: true, walletBalance: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return { accessToken, user: { ...user, walletBalance: Number(user.walletBalance) } };
  }
}
