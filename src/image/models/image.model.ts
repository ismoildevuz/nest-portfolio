import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Job } from '../../job/models/job.model';
import { Education } from '../../education/model/education.model';
import { SocialMedia } from '../../social-media/models/social-media.model';
import { Blog } from '../../blog/models/blog.model';

interface ImageAttrs {
  id: string;
  file_name: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  file_name: string;

  @HasMany(() => Job)
  job: Job;

  @HasMany(() => Education)
  education: Education;

  @HasMany(() => SocialMedia)
  socialMedia: SocialMedia;

  @HasMany(() => Blog)
  blog: Blog;
}
