import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Education } from './model/education.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from './../image/image.service';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education) private educationRepository: typeof Education,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
    image: Express.Multer.File,
  ) {
    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    const newEducation = await this.educationRepository.create({
      id: uuid(),
      ...createEducationDto,
      image_name: fileName,
    });
    return this.getOne(newEducation.id);
  }

  async findAll() {
    return this.educationRepository.findAll({
      attributes: [
        'id',
        'date_from',
        'date_to',
        'place',
        'major',
        'image_name',
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
    image: Express.Multer.File,
  ) {
    const education = await this.getOne(id);
    if (image) {
      if (education.image_name) {
        await this.educationRepository.update(
          { image_name: null },
          { where: { id } },
        );
        await this.imageService.remove(education.image_name);
      }
      const fileName = await this.imageService.create(image);
      await this.educationRepository.update(
        { image_name: fileName },
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
    // await this.educationRepository.destroy({ where: { id } });
    if (education.image_name) {
      // await this.imageService.remove(education.image_name);
    }
    return education;
  }

  async getOne(id: string) {
    const education = await this.educationRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'date_from',
        'date_to',
        'place',
        'major',
        'image_name',
      ],
    });
    if (!education) {
      throw new HttpException('Education not found', HttpStatus.NOT_FOUND);
    }
    return education;
  }
}
