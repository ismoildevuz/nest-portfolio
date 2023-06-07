import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Message } from '../../message/models/message.model';

interface ChatAttrs {
  id: string;
  user_id: string;
}

@Table({ tableName: 'chat' })
export class Chat extends Model<Chat, ChatAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Message)
  message: Message;
}
