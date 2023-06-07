import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';

interface SocialMediaAttrs {
  id: string;
  name: string;
  link: string;
  image_id: string;
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

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Image)
  image: Image;
}
