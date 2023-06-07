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

interface RatingAttrs {
  id: string;
  rate: number;
  user_id: string;
  project_id: string;
}

@Table({ tableName: 'rating' })
export class Rating extends Model<Rating, RatingAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.INTEGER,
  })
  rate: number;

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
