import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';

@Controller('api/banners')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }
}
