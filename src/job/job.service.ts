import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './models/job.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job) private jobRepository: typeof Job) {}

  async create(createJobDto: CreateJobDto) {
    const id = uuid();
    return this.jobRepository.create({ id, ...createJobDto });
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
    });
  }

  async findOne(id: string) {
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
    });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id);
    await this.jobRepository.update(updateJobDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const job = await this.findOne(id);
    await this.jobRepository.destroy({ where: { id } });
    return job;
  }
}
