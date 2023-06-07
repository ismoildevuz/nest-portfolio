import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  level?: number;
}
