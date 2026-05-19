import { Module } from '@nestjs/common';
import { S3uploaderService } from './s3-uploader.service';

@Module({
  providers: [S3uploaderService],
  exports: [S3uploaderService],
})
export class S3uploaderModule {}
