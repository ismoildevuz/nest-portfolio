import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message) private messageRepository: typeof Message,
    private readonly chatService: ChatService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const id = uuid();
    await this.chatService.findOne(createMessageDto.chat_id);
    return this.messageRepository.create({ id, ...createMessageDto });
  }

  async findAll() {
    return this.messageRepository.findAll({
      attributes: ['id', 'body', 'is_user', 'createdAt', 'chat_id'],
    });
  }

  async findOne(id: string) {
    const Message = await this.messageRepository.findOne({
      where: { id },
      attributes: ['id', 'body', 'is_user', 'createdAt', 'chat_id'],
    });
    if (!Message) {
      throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    }
    return Message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);
    await this.messageRepository.update(updateMessageDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const Message = await this.findOne(id);
    await this.messageRepository.destroy({ where: { id } });
    return Message;
  }
}
