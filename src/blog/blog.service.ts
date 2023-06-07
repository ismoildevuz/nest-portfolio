import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { ImageService } from '../image/image.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog) private blogRepository: typeof Blog,
    private readonly imageService: ImageService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const id = uuid();
    await this.imageService.findOne(createBlogDto.image_id);
    return this.blogRepository.create({ id, views: 0, ...createBlogDto });
  }

  async findAll() {
    return this.blogRepository.findAll({
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_id'],
    });
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_id'],
    });
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    await this.findOne(id);
    await this.blogRepository.update(updateBlogDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const blog = await this.findOne(id);
    await this.blogRepository.destroy({ where: { id } });
    return blog;
  }
}
