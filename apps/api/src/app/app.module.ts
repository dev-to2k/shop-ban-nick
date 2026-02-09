import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccountModule } from '@shop-ban-nick/feature-account/api';
import { AuthModule } from '@shop-ban-nick/feature-auth/api';
import { BannerModule } from '@shop-ban-nick/feature-banner/api';
import { GameModule } from '@shop-ban-nick/feature-game/api';
import { OrderModule } from '@shop-ban-nick/feature-order/api';
import { UploadModule } from '@shop-ban-nick/feature-upload/api';
import { WalletModule } from '@shop-ban-nick/feature-wallet/api';
import { PrismaModule } from '@shop-ban-nick/nest-prisma';

import { BlogModule } from './blog/blog.module';

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
    BlogModule,
  ],
})
export class AppModule {}
