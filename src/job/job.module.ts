import { Module, forwardRef } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './models/job.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [SequelizeModule.forFeature([Job]), forwardRef(() => ImageModule)],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
