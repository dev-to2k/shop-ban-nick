import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '@shop-ban-nick/feature-auth/api';

const storage = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}`, originalName: file.originalname };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({ url: `/uploads/${file.filename}`, originalName: file.originalname }));
  }
}
