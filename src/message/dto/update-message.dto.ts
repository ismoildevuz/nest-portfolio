import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsBoolean()
  is_user?: boolean;

  @IsOptional()
  @IsString()
  chat_id?: string;
}
