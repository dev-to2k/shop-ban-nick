import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { CreateDepositRequestDto } from './dto';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  getWallet(@Request() req: any) {
    return this.wallet.getWallet(req.user.userId);
  }

  @Get('transactions')
  getTransactions(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.wallet.getTransactions(req.user.userId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
    });
  }

  @Post('deposit')
  createDepositRequest(
    @Request() req: any,
    @Body() dto: CreateDepositRequestDto,
    @Query('returnUrl') returnUrl?: string,
    @Query('cancelUrl') cancelUrl?: string
  ) {
    return this.wallet.createDepositRequest(
      req.user.userId,
      dto.amount,
      dto.provider ?? 'DEMO',
      returnUrl,
      cancelUrl
    );
  }

  @Get('deposit/:id')
  getDepositRequest(@Request() req: any, @Param('id') id: string) {
    return this.wallet.getDepositRequest(id, req.user.userId);
  }

  @Post('deposit/:id/confirm')
  confirmDepositRequest(@Request() req: any, @Param('id') id: string) {
    return this.wallet.confirmDepositRequest(id, req.user.userId);
  }
}
