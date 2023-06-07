import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Rating } from '../../rating/models/rating.model';
import { Comment } from '../../comment/models/comment.model';

interface UserAttrs {
  id: string;
  fullname: string;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  fullname: string;

  @HasMany(() => Rating)
  rating: Rating;

  @HasMany(() => Comment)
  comment: Comment;
}
