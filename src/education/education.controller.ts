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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createEducationDto: CreateEducationDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.educationService.create(createEducationDto, image);
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
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.educationService.update(id, updateEducationDto, image);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.educationService.remove(id);
  }
}
