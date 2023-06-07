import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { v4 as uuid } from 'uuid';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating) private ratingRepository: typeof Rating,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const id = uuid();
    await this.userService.findOne(createRatingDto.user_id);
    await this.projectService.findOne(createRatingDto.project_id);
    return this.ratingRepository.create({ id, ...createRatingDto });
  }

  async findAll() {
    return this.ratingRepository.findAll({
      attributes: ['id', 'rate', 'user_id', 'project_id'],
    });
  }

  async findOne(id: string) {
    const rating = await this.ratingRepository.findOne({
      where: { id },
      attributes: ['id', 'rate', 'user_id', 'project_id'],
    });
    if (!rating) {
      throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
    }
    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    await this.findOne(id);
    await this.ratingRepository.update(updateRatingDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const rating = await this.findOne(id);
    await this.ratingRepository.destroy({ where: { id } });
    return rating;
  }
}
