import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';

interface ProjectAttrs {
  id: string;
  name: string;
  description: string;
  link_project: string;
  link_github: string;
  views: number;
  image_id: string;
}

@Table({ tableName: 'project' })
export class Project extends Model<Project, ProjectAttrs> {
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
  description: string;

  @Column({
    type: DataType.STRING,
  })
  link_project: string;

  @Column({
    type: DataType.STRING,
  })
  link_github: string;

  @Column({
    type: DataType.INTEGER,
  })
  views: number;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Image)
  image: Image;
}
