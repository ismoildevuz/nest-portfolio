import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  project_id?: string;
}
