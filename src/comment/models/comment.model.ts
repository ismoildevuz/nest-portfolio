import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Project } from '../../project/models/project.model';

interface CommentAttrs {
  id: string;
  body: string;
  user_id: string;
  project_id: string;
}

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  body: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.STRING,
  })
  project_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Project)
  project: Project;
}
