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
    const newSkill = await this.skillRepository.create({
      id: uuid(),
      ...createSkillDto,
    });
    return this.getOne(newSkill.id);
  }

  async findAll() {
    return this.skillRepository.findAll({
      attributes: ['id', 'name'],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.getOne(id);
    await this.skillRepository.update(updateSkillDto, { where: { id } });
    return this.getOne(id);
  }

  async remove(id: string) {
    const skill = await this.getOne(id);
    // await this.skillRepository.destroy({ where: { id } });
    return skill;
  }

  async getOne(id: string) {
    const skill = await this.skillRepository.findOne({
      where: { id },
      attributes: ['id', 'name'],
    });
    if (!skill) {
      throw new HttpException('Skill not found', HttpStatus.NOT_FOUND);
    }
    return skill;
  }
}
