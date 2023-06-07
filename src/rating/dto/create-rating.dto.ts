import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  project_id: string;
}
