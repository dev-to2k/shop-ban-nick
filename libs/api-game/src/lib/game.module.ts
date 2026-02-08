import { Module } from '@nestjs/common';
import { AuthModule } from '@shop-ban-nick/api-auth';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { AdminGameController } from './admin-game.controller';

@Module({
  imports: [AuthModule],
  controllers: [GameController, AdminGameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
