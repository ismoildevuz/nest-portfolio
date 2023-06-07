import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './models/project.model';
import { InjectModel } from '@nestjs/sequelize';
import { ImageService } from '../image/image.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project) private projectRepository: typeof Project,
    private readonly imageService: ImageService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const id = uuid();
    await this.imageService.findOne(createProjectDto.image_id);
    return this.projectRepository.create({ id, views: 0, ...createProjectDto });
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
    });
  }

  async findOne(id: string) {
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
    });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    await this.projectRepository.update(updateProjectDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.projectRepository.destroy({ where: { id } });
    return project;
  }
}
