import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { CreateGameDto, UpdateGameDto } from './dto';

@Controller('api/admin/games')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminGameController {
  constructor(private gameService: GameService) {}

  @Get()
  findAll() {
    return this.gameService.findAll(false);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.gameService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateGameDto) {
    return this.gameService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gameService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
