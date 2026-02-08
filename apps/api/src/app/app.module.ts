import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@shop-ban-nick/nest-prisma';
import { AuthModule } from '@shop-ban-nick/feature-auth/api';
import { GameModule } from '@shop-ban-nick/feature-game/api';
import { AccountModule } from '@shop-ban-nick/feature-account/api';
import { OrderModule } from '@shop-ban-nick/feature-order/api';
import { WalletModule } from '@shop-ban-nick/feature-wallet/api';
import { BannerModule } from '@shop-ban-nick/feature-banner/api';
import { UploadModule } from '@shop-ban-nick/feature-upload/api';

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
