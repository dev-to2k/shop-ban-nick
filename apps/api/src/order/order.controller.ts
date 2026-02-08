import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.userId, dto);
  }

  @Get('my')
  findMy(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.orderService.findByUser(req.user.userId, { page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Put(':id/payment-proof')
  uploadPaymentProof(@Request() req: any, @Param('id') id: string, @Body() dto: { paymentProof: string }) {
    return this.orderService.uploadPaymentProof(id, req.user.userId, dto.paymentProof);
  }
}
