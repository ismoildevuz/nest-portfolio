import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './models/job.model';
import { v4 as uuid } from 'uuid';
import { ImageService } from '../image/image.service';
import { Image } from '../image/models/image.model';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job) private jobRepository: typeof Job,
    private readonly imageService: ImageService,
  ) {}

  async create(createJobDto: CreateJobDto, images: Express.Multer.File[]) {
    const uploadedImages = await this.imageService.create(images);
    const newJob = await this.jobRepository.create({
      id: uuid(),
      ...createJobDto,
      image_id: uploadedImages[0]?.id,
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
        'image_id',
      ],
      include: [Image],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    images: Express.Multer.File[],
  ) {
    const job = await this.getOne(id);
    if (images.length) {
      if (job.image_id) {
        await this.jobRepository.update({ image_id: null }, { where: { id } });
        await this.imageService.remove(job.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.jobRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.jobRepository.update(updateJobDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const job = await this.findOne(id);
    await this.jobRepository.destroy({ where: { id } });
    if (job.image_id) {
      await this.imageService.remove(job.image_id);
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
        'image_id',
      ],
      include: [Image],
    });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }
}
