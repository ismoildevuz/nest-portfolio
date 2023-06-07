import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';

interface BlogAttrs {
  id: string;
  title: string;
  body: string;
  views: number;
  image_id: string;
}

@Table({ tableName: 'blog' })
export class Blog extends Model<Blog, BlogAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.STRING,
  })
  body: string;

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
