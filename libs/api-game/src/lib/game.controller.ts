import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('api/games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  findAll() {
    return this.gameService.findAll(true);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.gameService.findBySlug(slug);
  }
}
