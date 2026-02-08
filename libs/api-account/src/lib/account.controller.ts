import { Controller, Get, Param, Query } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('api')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('games/:slug/accounts')
  findByGame(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string
  ) {
    return this.accountService.findByGame(slug, {
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined,
      sortBy,
      sortOrder,
      search,
    });
  }

  @Get('accounts/:id')
  findById(@Param('id') id: string) {
    return this.accountService.findById(id);
  }
}
