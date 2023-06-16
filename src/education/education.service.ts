import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Education } from './model/education.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from './../image/image.service';
import { Image } from '../image/models/image.model';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education) private educationRepository: typeof Education,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
    images: Express.Multer.File[],
  ) {
    const uploadedImages = await this.imageService.create(images);
    const newSocialMedia = await this.educationRepository.create({
      id: uuid(),
      ...createEducationDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.getOne(newSocialMedia.id);
  }

  async findAll() {
    return this.educationRepository.findAll({
      attributes: ['id', 'date_from', 'date_to', 'place', 'major', 'image_id'],
      include: [Image],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
    images: Express.Multer.File[],
  ) {
    const education = await this.getOne(id);
    if (images.length) {
      if (education.image_id) {
        await this.educationRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(education.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.educationRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.educationRepository.update(updateEducationDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    const education = await this.getOne(id);
    await this.educationRepository.destroy({ where: { id } });
    if (education.image_id) {
      await this.imageService.remove(education.image_id);
    }
    return education;
  }

  async getOne(id: string) {
    const education = await this.educationRepository.findOne({
      where: { id },
      attributes: ['id', 'date_from', 'date_to', 'place', 'major', 'image_id'],
      include: [Image],
    });
    if (!education) {
      throw new HttpException('Education not found', HttpStatus.NOT_FOUND);
    }
    return education;
  }
}
