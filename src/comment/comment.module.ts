import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Comment]),
    forwardRef(() => UserModule),
    forwardRef(() => ProjectModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
