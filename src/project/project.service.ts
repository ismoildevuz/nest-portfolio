import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './models/project.model';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from '../image/image.service';
import { v4 as uuid } from 'uuid';
import { Image } from '../image/models/image.model';
import { Rating } from '../rating/models/rating.model';
import { Comment } from '../comment/models/comment.model';
import { User } from '../user/models/user.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    images: Express.Multer.File[],
  ) {
    const uploadedImages = await this.imageService.create(images);
    const newProject = await this.projectRepository.create({
      id: uuid(),
      views: 0,
      ...createProjectDto,
      image_id: uploadedImages[0]?.id,
    });
    return this.findOne(newProject.id);
  }

  async findAll() {
    return this.projectRepository.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'link_project',
        'link_github',
        'views',
        'image_id',
      ],
      include: [
        { model: Image },
        Rating,
        {
          model: Comment,
          attributes: ['id', 'body', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'fullname'],
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string) {
    const project = await this.getOne(id);
    await this.projectRepository.update(
      { views: project.views + 1 },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    images: Express.Multer.File[],
  ) {
    const project = await this.getOne(id);
    if (images.length) {
      console.log('test 1');

      if (project.image_id) {
        console.log('test 1');
        await this.projectRepository.update(
          { image_id: null },
          { where: { id } },
        );
        await this.imageService.remove(project.image_id);
      }
      const uploadedImages = await this.imageService.create(images);
      await this.projectRepository.update(
        { image_id: uploadedImages[0]?.id },
        { where: { id } },
      );
    }
    await this.projectRepository.update(updateProjectDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const project = await this.getOne(id);
    await this.projectRepository.destroy({ where: { id } });
    if (project.image_id) {
      await this.imageService.remove(project.image_id);
    }
    return project;
  }

  async getOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'description',
        'link_project',
        'link_github',
        'views',
        'image_id',
      ],
      include: [
        {
          model: Image,
        },
        {
          model: Rating,
          attributes: ['id', 'rate'],
        },
        {
          model: Comment,
          attributes: ['id', 'body', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['id', 'fullname'],
            },
          ],
        },
      ],
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }
}
