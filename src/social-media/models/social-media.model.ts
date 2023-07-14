import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface SocialMediaAttrs {
  id: string;
  name: string;
  link: string;
  image_name: string;
}

@Table({ tableName: 'social_media' })
export class SocialMedia extends Model<SocialMedia, SocialMediaAttrs> {
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
  link: string;

  @Column({
    type: DataType.STRING,
  })
  image_name: string;
}
