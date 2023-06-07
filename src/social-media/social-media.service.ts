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

  async create(createSocialMediaDto: CreateSocialMediaDto) {
    const id = uuid();
    await this.imageService.findOne(createSocialMediaDto.image_id);
    return this.socialMediaRepository.create({ id, ...createSocialMediaDto });
  }

  async findAll() {
    return this.socialMediaRepository.findAll({
      attributes: ['id', 'name', 'link', 'image_id'],
    });
  }

  async findOne(id: string) {
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'link', 'image_id'],
    });
    if (!socialMedia) {
      throw new HttpException('Social Media not found', HttpStatus.NOT_FOUND);
    }
    return socialMedia;
  }

  async update(id: string, updateSocialMediaDto: UpdateSocialMediaDto) {
    await this.findOne(id);
    await this.socialMediaRepository.update(updateSocialMediaDto, {
      where: { id },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const socialMedia = await this.findOne(id);
    await this.socialMediaRepository.destroy({ where: { id } });
    return socialMedia;
  }
}
