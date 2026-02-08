import { Module } from '@nestjs/common';
import { AuthModule } from '@shop-ban-nick/api-auth';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [AuthModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
