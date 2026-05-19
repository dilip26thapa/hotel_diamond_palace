import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDifferentFiles } from './types';
import getFileName from 'src/utils/getFilename';

@Injectable()
export class S3uploaderService {
  constructor(private readonly configService: ConfigService) {}

  async getObject(fileName: string) {
    const s3 = this.getS3();
    const params = new GetObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: fileName,
    });
    try {
      const response = await s3.send(params);
      const result = await response.Body.transformToByteArray();
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadFile(image: Express.Multer.File) {
    const { uploadFileName, extension } = getFileName(image);
    const fileName = `https://${this.configService.get<string>('AWS_BUCKET_NAME')}.s3.${this.configService.get<string>(
      'AWS_REGION'
    )}.amazonaws.com/${uploadFileName}.${extension}`;
    try {
      await this.uploadS3(image.buffer, image.mimetype, uploadFileName);
      return fileName;
    } catch (error) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadFiles(images: Array<Express.Multer.File>) {
    const fileNames: string[] = [];
    const uploadImagesPromises = images.map(file => {
      const { uploadFileName, extension } = getFileName(file);
      const fileName = `https://${this.configService.get<string>(
        'AWS_BUCKET_NAME'
      )}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${uploadFileName}.${extension}`;
      fileNames.push(fileName);
      return this.uploadS3(file.buffer, file.mimetype, uploadFileName);
    });
    try {
      await Promise.all(uploadImagesPromises);
      return fileNames;
    } catch (error) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadDifferentFiles(images: IDifferentFiles) {
    type IDifferentFilesKey = keyof IDifferentFiles;
    const fileNames: Record<IDifferentFilesKey, Promise<string | string[]> | string | string[]> = {};
    Object.entries(images).forEach(([key, file]) => {
      if (file.length > 1) {
        fileNames[key] = this.uploadFiles(file);
      } else {
        fileNames[key] = this.uploadFile(file[0]);
      }
    });
    try {
      const resolvedUrls = await Promise.all(Object.values(fileNames));
      Object.keys(fileNames).forEach((key, index) => {
        fileNames[key] = resolvedUrls[index];
      });

      return fileNames;
    } catch (error) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadS3(file: Buffer, mimeType: string, name: string) {
    const s3 = this.getS3();
    const params = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: `${String(name)}.${mimeType.split('/')[1]}`,
      Body: file,
      ContentType: mimeType,
    });
    try {
      const response = s3.send(params);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getS3() {
    return new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }
}
