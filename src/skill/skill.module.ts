import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Skill } from './models/skill.model';

@Module({
  imports: [SequelizeModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService],
  exports: [SkillService],
})
export class SkillModule {}
