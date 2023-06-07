import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './models/job.model';

@Module({
  imports: [SequelizeModule.forFeature([Job])],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
