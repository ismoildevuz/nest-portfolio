import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface SkillAttrs {
  id: string;
  name: string;
  level: number;
}

@Table({ tableName: 'skill' })
export class Skill extends Model<Skill, SkillAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  level: number;
}
