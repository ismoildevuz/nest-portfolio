import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Skill } from './models/skill.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill) private skillRepository: typeof Skill) {}

  async create(createSkillDto: CreateSkillDto) {
    const id = uuid();
    return this.skillRepository.create({ id, ...createSkillDto });
  }

  async findAll() {
    return this.skillRepository.findAll({
      attributes: ['id', 'name', 'level'],
    });
  }

  async findOne(id: string) {
    const skill = await this.skillRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'level'],
    });
    if (!skill) {
      throw new HttpException('Skill not found', HttpStatus.NOT_FOUND);
    }
    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id);
    await this.skillRepository.update(updateSkillDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const skill = await this.findOne(id);
    await this.skillRepository.destroy({ where: { id } });
    return skill;
  }
}
