import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './models/job.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from '../image/image.service';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job) private jobRepository: typeof Job,
    private readonly imageService: ImageService,
  ) {}

  async create(createJobDto: CreateJobDto, image: Express.Multer.File) {
    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    const newJob = await this.jobRepository.create({
      id: uuid(),
      ...createJobDto,
      image_name: fileName,
    });
    return this.getOne(newJob.id);
  }

  async findAll() {
    return this.jobRepository.findAll({
      attributes: [
        'id',
        'date_from',
        'date_to',
        'company',
        'position',
        'image_name',
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    image: Express.Multer.File,
  ) {
    const job = await this.getOne(id);
    if (image) {
      if (job.image_name) {
        await this.jobRepository.update(
          { image_name: null },
          { where: { id } },
        );
        await this.imageService.remove(job.image_name);
      }
      const fileName = await this.imageService.create(image);
      await this.jobRepository.update(
        { image_name: fileName },
        { where: { id } },
      );
    }
    await this.jobRepository.update(updateJobDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const job = await this.findOne(id);
    await this.jobRepository.destroy({ where: { id } });
    if (job.image_name) {
      await this.imageService.remove(job.image_name);
    }
    return job;
  }

  async getOne(id: string) {
    const job = await this.jobRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'date_from',
        'date_to',
        'company',
        'position',
        'image_name',
      ],
    });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }
}
