import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { UserService } from '../user/user.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat) private chatRepository: typeof Chat,
    private readonly userService: UserService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const id = uuid();
    await this.userService.findOne(createChatDto.user_id);
    return this.chatRepository.create({ id, ...createChatDto });
  }

  async findAll() {
    return this.chatRepository.findAll({
      attributes: ['id', 'user_id'],
    });
  }

  async findOne(id: string) {
    const chat = await this.chatRepository.findOne({
      where: { id },
      attributes: ['id', 'user_id'],
    });
    if (!chat) {
      throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    await this.findOne(id);
    await this.chatRepository.update(updateChatDto, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: string) {
    const chat = await this.findOne(id);
    // await this.chatRepository.destroy({ where: { id } });
    return chat;
  }
}
