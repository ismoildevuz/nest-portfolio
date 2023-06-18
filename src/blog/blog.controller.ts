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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.blogService.create(createBlogDto, images);
  }

  @Get()
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.blogService.update(id, updateBlogDto, images);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
