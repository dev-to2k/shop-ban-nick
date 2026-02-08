import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@shop-ban-nick/nest-prisma';
import { AuthModule } from '@shop-ban-nick/api-auth';
import { GameModule } from '@shop-ban-nick/api-game';
import { AccountModule } from '@shop-ban-nick/api-account';
import { OrderModule } from '@shop-ban-nick/api-order';
import { WalletModule } from '@shop-ban-nick/api-wallet';
import { BannerModule } from '@shop-ban-nick/api-banner';
import { UploadModule } from '@shop-ban-nick/api-upload';

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
