import { Module, forwardRef } from '@nestjs/common';
import { SocialMediaService } from './social-media.service';
import { SocialMediaController } from './social-media.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialMedia } from './models/social-media.model';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SocialMedia]),
    forwardRef(() => ImageModule),
  ],
  controllers: [SocialMediaController],
  providers: [SocialMediaService],
  exports: [SocialMediaService],
})
export class SocialMediaModule {}
