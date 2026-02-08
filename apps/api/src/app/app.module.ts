import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from '../game/game.module';
import { AccountModule } from '../account/account.module';
import { OrderModule } from '../order/order.module';
import { UploadModule } from '../upload/upload.module';
import { WalletModule } from '../wallet/wallet.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BannerModule } from '../banner/banner.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    GameModule,
    AccountModule,
    OrderModule,
    UploadModule,
    WalletModule,
    BannerModule,
  ],
})
export class AppModule {}
