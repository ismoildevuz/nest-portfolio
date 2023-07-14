import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface BlogAttrs {
  id: string;
  title: string;
  body: string;
  views: number;
  image_name: string;
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
    type: DataType.TEXT,
  })
  body: string;

  @Column({
    type: DataType.INTEGER,
  })
  views: number;

  @Column({
    type: DataType.STRING,
  })
  image_name: string;
}
