import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { AdminGameController } from './admin-game.controller';

@Module({
  controllers: [GameController, AdminGameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
