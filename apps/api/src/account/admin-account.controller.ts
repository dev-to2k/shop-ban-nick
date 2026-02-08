import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { CreateAccountDto } from './dto';

@Controller('api/admin/accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminAccountController {
  constructor(private accountService: AccountService) {}

  @Get('game/:gameId')
  findAllByGame(
    @Param('gameId') gameId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string
  ) {
    return this.accountService.findAllByGame(gameId, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      status,
    });
  }

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dto: { accounts: CreateAccountDto[] }) {
    return this.accountService.createBulk(dto.accounts);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Record<string, any>) {
    return this.accountService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
