import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
