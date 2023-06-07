import { Module, forwardRef } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Education } from './model/education.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Education]),
    forwardRef(() => ImageModule),
  ],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
