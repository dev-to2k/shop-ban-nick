import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@shop-ban-nick/feature-auth/api';
import { CreateOrderDto } from './dto';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Request() req: { user: { userId: string } }, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.userId, dto);
  }

  @Get('my')
  findMy(@Request() req: { user: { userId: string } }, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.orderService.findByUser(req.user.userId, { page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Put(':id/payment-proof')
  uploadPaymentProof(@Request() req: { user: { userId: string } }, @Param('id') id: string, @Body() dto: { paymentProof: string }) {
    return this.orderService.uploadPaymentProof(id, req.user.userId, dto.paymentProof);
  }
}
