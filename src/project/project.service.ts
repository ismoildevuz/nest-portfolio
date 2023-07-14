import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './models/project.model';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from '../image/image.service';
import { v4 as uuid } from 'uuid';
import { Rating } from '../rating/models/rating.model';
import { Comment } from '../comment/models/comment.model';
import { User } from '../user/models/user.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project,
    private readonly imageService: ImageService,
  ) {}

  async create(createProjectDto: CreateProjectDto, image: Express.Multer.File) {
    let fileName = null;
    if (image) fileName = await this.imageService.create(image);
    const newProject = await this.projectRepository.create({
      id: uuid(),
      views: 0,
      ...createProjectDto,
      image_name: fileName,
    });
    return this.getOne(newProject.id);
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
        'image_name',
      ],
      include: [
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
    image: Express.Multer.File,
  ) {
    const project = await this.getOne(id);
    if (image) {
      if (project.image_name) {
        await this.projectRepository.update(
          { image_name: null },
          { where: { id } },
        );
        await this.imageService.remove(project.image_name);
      }
      const fileName = await this.imageService.create(image);
      await this.projectRepository.update(
        { image_name: fileName },
        { where: { id } },
      );
    }
    await this.projectRepository.update(updateProjectDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const project = await this.getOne(id);
    await this.projectRepository.destroy({ where: { id } });
    if (project.image_name) {
      await this.imageService.remove(project.image_name);
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
        'image_name',
      ],
      include: [
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
