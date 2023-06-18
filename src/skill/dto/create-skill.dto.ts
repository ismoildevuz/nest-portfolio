import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
