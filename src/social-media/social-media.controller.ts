import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@Controller('social-media')
export class SocialMediaController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createSocialMediaDto: CreateSocialMediaDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.socialMediaService.create(createSocialMediaDto, image);
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.socialMediaService.update(id, updateSocialMediaDto, image);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.socialMediaService.remove(id);
  }
}
