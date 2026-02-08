import { Module } from '@nestjs/common';
import { AuthModule } from '@shop-ban-nick/api-auth';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AdminOrderController } from './admin-order.controller';

@Module({
  imports: [AuthModule],
  controllers: [OrderController, AdminOrderController],
  providers: [OrderService],
})
export class OrderModule {}
