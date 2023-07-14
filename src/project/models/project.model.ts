import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Rating } from '../../rating/models/rating.model';
import { Comment } from '../../comment/models/comment.model';

interface ProjectAttrs {
  id: string;
  name: string;
  description: string;
  link_project: string;
  link_github: string;
  views: number;
  image_name: string;
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
    type: DataType.TEXT,
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

  @Column({
    type: DataType.STRING,
  })
  image_name: string;

  @HasMany(() => Rating)
  rating: Rating;

  @HasMany(() => Comment)
  comment: Comment;
}
