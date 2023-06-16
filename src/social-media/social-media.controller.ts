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
} from '@nestjs/common';
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createSocialMediaDto: CreateSocialMediaDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.socialMediaService.create(createSocialMediaDto, images);
  }

  @Get()
  async findAll() {
    return this.socialMediaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.socialMediaService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.socialMediaService.update(id, updateSocialMediaDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.socialMediaService.remove(id);
  }
}
