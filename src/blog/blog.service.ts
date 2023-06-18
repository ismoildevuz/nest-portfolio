import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './models/blog.model';
import { ImageService } from '../image/image.service';
import { v4 as uuid } from 'uuid';
import { Image } from '../image/models/image.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog) private blogRepository: typeof Blog,
    private readonly imageService: ImageService,
  ) {}

  async create(createBlogDto: CreateBlogDto, images: Express.Multer.File[]) {
    const uploadedImages = await this.imageService.create(images);
    const newBlog = await this.blogRepository.create({
      id: uuid(),
      views: 0,
      ...createBlogDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.getOne(newBlog.id);
  }

  async findAll() {
    return this.blogRepository.findAll({
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_id'],
      include: [Image],
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
    images: Express.Multer.File[],
  ) {
    const blog = await this.getOne(id);
    if (images.length) {
      if (blog.image_id) {
        await this.blogRepository.update({ image_id: null }, { where: { id } });
        await this.imageService.remove(blog.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.blogRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.blogRepository.update(updateBlogDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const blog = await this.getOne(id);
    await this.blogRepository.destroy({ where: { id } });
    if (blog.image_id) {
      await this.imageService.remove(blog.image_id);
    }
    return blog;
  }

  async getOne(id: string) {
    const blog = await this.blogRepository.findOne({
      where: { id },
      attributes: ['id', 'title', 'body', 'views', 'createdAt', 'image_id'],
      include: [Image],
    });
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }
}
