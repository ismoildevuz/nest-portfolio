import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './models/comment.model';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const id = uuid();
    await this.userService.findOne(createCommentDto.user_id);
    await this.projectService.getOne(createCommentDto.project_id);
    return this.commentRepository.create({ id, ...createCommentDto });
  }

  async findAll() {
    return this.commentRepository.findAll({
      attributes: ['id', 'body', 'user_id', 'project_id'],
    });
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      attributes: ['id', 'body', 'user_id', 'project_id'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);
    if (updateCommentDto.user_id) {
      await this.userService.findOne(updateCommentDto.user_id);
    }
    if (updateCommentDto.project_id) {
      await this.projectService.getOne(updateCommentDto.project_id);
    }
    await this.commentRepository.update(updateCommentDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const comment = await this.findOne(id);
    // await this.commentRepository.destroy({ where: { id } });
    return comment;
  }
}
