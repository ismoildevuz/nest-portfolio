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

  async create(createBlogDto: CreateBlogDto, image: Express.Multer.File) {
    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    const newBlog = await this.blogRepository.create({
      id: uuid(),
      views: 0,
      ...createBlogDto,
      image_name: fileName,
    });
    return this.getOne(newBlog.id);
  }

  async findAll() {
    return this.blogRepository.findAll({
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_name'],
    });
  }

  async findOne(id: string) {
    const blog = await this.getOne(id);
    await this.blogRepository.update(
      { views: blog.views + 1 },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    image: Express.Multer.File,
  ) {
    const blog = await this.getOne(id);
    if (image) {
      if (blog.image_name) {
        await this.blogRepository.update(
          { image_name: null },
          { where: { id } },
        );
        await this.imageService.remove(blog.image_name);
      }
      const fileName = await this.imageService.create(image);
      await this.blogRepository.update(
        { image_name: fileName },
        { where: { id } },
      );
    }
    await this.blogRepository.update(updateBlogDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const blog = await this.getOne(id);
    await this.blogRepository.destroy({ where: { id } });
    if (blog.image_name) {
      await this.imageService.remove(blog.image_name);
    }
    return blog;
  }

  async getOne(id: string) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_name'],
    });
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }
}
