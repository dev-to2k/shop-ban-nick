import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AdminAccountController } from './admin-account.controller';

@Module({
  controllers: [AccountController, AdminAccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
