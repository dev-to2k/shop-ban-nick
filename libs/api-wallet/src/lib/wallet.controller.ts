import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shop-ban-nick/api-auth';
import { WalletService } from './wallet.service';
import { CreateDepositRequestDto } from './dto';

@Controller('api/wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private wallet: WalletService) {}

  @Get()
  getWallet(@Request() req: { user: { userId: string } }) {
    return this.wallet.getWallet(req.user.userId);
  }

  @Get('transactions')
  getTransactions(
    @Request() req: { user: { userId: string } },
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.wallet.getTransactions(req.user.userId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
    });
  }

  @Post('deposit')
  createDepositRequest(
    @Request() req: { user: { userId: string } },
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
  getDepositRequest(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.wallet.getDepositRequest(id, req.user.userId);
  }

  @Post('deposit/:id/confirm')
  confirmDepositRequest(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
    return this.wallet.confirmDepositRequest(id, req.user.userId);
  }
}
