import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':fileName')
  async getOne(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.imageService.getOne(fileName, res);
  }
}
