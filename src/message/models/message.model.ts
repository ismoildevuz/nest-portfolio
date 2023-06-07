import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chat } from '../../chat/models/chat.model';

interface MessageAttrs {
  id: string;
  body: string;
  is_user: boolean;
  chat_id: string;
}

@Table({ tableName: 'message' })
export class Message extends Model<Message, MessageAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  body: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_user: boolean;

  @ForeignKey(() => Chat)
  @Column({
    type: DataType.STRING,
  })
  chat_id: string;

  @BelongsTo(() => Chat)
  chat: Chat;
}
