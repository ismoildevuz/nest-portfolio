import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;
}
