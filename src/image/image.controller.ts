import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createImageDto: CreateImageDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.imageService.create(createImageDto, images);
  }

  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.imageService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imageService.update(id, updateImageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.imageService.remove(id);
  }

  @Get('/file/:imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    return this.imageService.getImage(imageName, res);
  }
}
