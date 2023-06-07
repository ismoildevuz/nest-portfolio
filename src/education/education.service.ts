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

  async create(createEducationDto: CreateEducationDto) {
    const id = uuid();
    await this.imageService.findOne(createEducationDto.image_id);
    return this.educationRepository.create({ id, ...createEducationDto });
  }

  async findAll() {
    return this.educationRepository.findAll({
      attributes: ['id', 'date_from', 'date_to', 'place', 'major', 'image_id'],
    });
  }

  async findOne(id: string) {
    const education = await this.educationRepository.findOne({
      where: { id },
      attributes: ['id', 'date_from', 'date_to', 'place', 'major', 'image_id'],
    });
    if (!education) {
      throw new HttpException('Education not found', HttpStatus.NOT_FOUND);
    }
    return education;
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    await this.findOne(id);
    await this.educationRepository.update(updateEducationDto, {
      where: { id },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const education = await this.findOne(id);
    await this.educationRepository.destroy({ where: { id } });
    return education;
  }
}
