import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './models/message.model';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Message]),
    forwardRef(() => ChatModule),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
