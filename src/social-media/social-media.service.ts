import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SocialMedia } from './models/social-media.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectModel(SocialMedia) private socialMediaRepository: typeof SocialMedia,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createSocialMediaDto: CreateSocialMediaDto,
    images: Express.Multer.File[],
  ) {
    const uploadedImages = await this.imageService.create(images);
    const newSocialMedia = await this.socialMediaRepository.create({
      id: uuid(),
      ...createSocialMediaDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.getOne(newSocialMedia.id);
  }

  async findAll() {
    return this.socialMediaRepository.findAll({
      attributes: ['id', 'name', 'link', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateSocialMediaDto: UpdateSocialMediaDto,
    images: Express.Multer.File[],
  ) {
    const socialMedia = await this.getOne(id);
    if (images.length) {
      if (socialMedia.image_id) {
        await this.socialMediaRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(socialMedia.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.socialMediaRepository.update(
        { image_id: uploadedImages[0]?.id },
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
    await this.socialMediaRepository.destroy({ where: { id } });
    if (socialMedia.image_id) {
      await this.imageService.remove(socialMedia.image_id);
    }
    return socialMedia;
  }

  async getOne(id: string) {
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'link', 'image_id'],
      include: [Image],
    });
    if (!socialMedia) {
      throw new HttpException('Social Media not found', HttpStatus.NOT_FOUND);
    }
    return socialMedia;
  }
}
