import { Module, forwardRef } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Image } from './models/image.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { EducationModule } from '../education/education.module';

@Module({
  imports: [SequelizeModule.forFeature([Image])],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
