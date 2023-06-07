import { Module, forwardRef } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Rating]),
    forwardRef(() => UserModule),
    forwardRef(() => ProjectModule),
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
