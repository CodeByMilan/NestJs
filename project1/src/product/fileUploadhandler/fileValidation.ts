import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSize: number = 1048576; // 1MB in bytes

  transform(file: Express.Multer.File): Express.Multer.File {
    if (file.size > this.maxSize) {
      throw new BadRequestException(`File size exceeds the maximum allowed size of ${this.maxSize / 1048576} MB.`);
    }
    return file;
  }
}


@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly allowedTypes: RegExp = /(image\/jpeg|image\/jpg|image\/png|image\/avif)$/i;

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!this.allowedTypes.test(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed. Only JPEG, JPG, PNG, and AVIF images are accepted.`);
    }
    return file;
  }
}
