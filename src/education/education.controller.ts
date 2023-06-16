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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.educationService.create(createEducationDto, images);
  }

  @Get()
  async findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.educationService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.educationService.update(id, updateEducationDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.educationService.remove(id);
  }
}
