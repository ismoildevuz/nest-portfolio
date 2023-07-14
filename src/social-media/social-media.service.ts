import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SocialMedia } from './models/social-media.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from '../image/image.service';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectModel(SocialMedia) private socialMediaRepository: typeof SocialMedia,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createSocialMediaDto: CreateSocialMediaDto,
    image: Express.Multer.File,
  ) {
    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    const newSocialMedia = await this.socialMediaRepository.create({
      id: uuid(),
      ...createSocialMediaDto,
      image_name: fileName,
    });
    return this.getOne(newSocialMedia.id);
  }

  async findAll() {
    return this.socialMediaRepository.findAll({
      attributes: ['id', 'name', 'link', 'image_name'],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateSocialMediaDto: UpdateSocialMediaDto,
    image: Express.Multer.File,
  ) {
    const socialMedia = await this.getOne(id);
    if (image) {
      if (socialMedia.image_name) {
        await this.socialMediaRepository.update(
          { image_name: null },
          { where: { id } },
        );
        await this.imageService.remove(socialMedia.image_name);
      }
      const fileName = await this.imageService.create(image);
      await this.socialMediaRepository.update(
        { image_name: fileName },
        { where: { id } },
      );
    }
    await this.socialMediaRepository.update(updateSocialMediaDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    const socialMedia = await this.findOne(id);
    // await this.socialMediaRepository.destroy({ where: { id } });
    if (socialMedia.image_name) {
      // await this.imageService.remove(socialMedia.image_name);
    }
    return socialMedia;
  }

  async getOne(id: string) {
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'link', 'image_name'],
    });
    if (!socialMedia) {
      throw new HttpException('Social Media not found', HttpStatus.NOT_FOUND);
    }
    return socialMedia;
  }
}
