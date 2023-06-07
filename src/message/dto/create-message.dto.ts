import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsBoolean()
  is_user: boolean;

  @IsNotEmpty()
  @IsString()
  chat_id: string;
}
