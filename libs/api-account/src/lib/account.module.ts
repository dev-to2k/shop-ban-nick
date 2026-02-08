import { Module } from '@nestjs/common';
import { AuthModule } from '@shop-ban-nick/api-auth';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AdminAccountController } from './admin-account.controller';

@Module({
  imports: [AuthModule],
  controllers: [AccountController, AdminAccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
