import { Controller, Get, Param, Put, Body, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard, RolesGuard, Roles } from '@shop-ban-nick/api-auth';
import type { OrderStatus } from '@shop-ban-nick/shared-types';
import { UpdateOrderStatusDto } from './dto';

@Controller('api/admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrderController {
  constructor(private orderService: OrderService) {}

  @Get('stats')
  getStats() {
    return this.orderService.getStats();
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.orderService.findAll({ page: page ? +page : undefined, limit: limit ? +limit : undefined, status });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto.status as OrderStatus);
  }
}
