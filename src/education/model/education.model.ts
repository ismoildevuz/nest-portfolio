import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';

interface EducationAttrs {
  id: string;
  date_from: string;
  date_to: string;
  place: string;
  major: string;
  image_id: string;
}

@Table({ tableName: 'education' })
export class Education extends Model<Education, EducationAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date_from: string;

  @Column({
    type: DataType.DATE,
  })
  date_to: string;

  @Column({
    type: DataType.STRING,
  })
  place: string;

  @Column({
    type: DataType.STRING,
  })
  major: string;

  @ForeignKey(() => Image)
  @Column({
    type: DataType.STRING,
  })
  image_id: string;

  @BelongsTo(() => Image)
  image: Image;
}
