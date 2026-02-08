import { Module } from '@nestjs/common';
import { AuthModule } from '@shop-ban-nick/feature-auth/api';
import { UploadController } from './upload.controller';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
})
export class UploadModule {}
