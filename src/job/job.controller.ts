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
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createJobDto: CreateJobDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.jobService.create(createJobDto, image);
  }

  @Get()
  async findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UploadedFile(new ImageValidationPipe()) image: Express.Multer.File,
  ) {
    return this.jobService.update(id, updateJobDto, image);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }
}
