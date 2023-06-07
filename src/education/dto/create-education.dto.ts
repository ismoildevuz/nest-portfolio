import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsNotEmpty()
  @IsDateString()
  date_from: string;

  @IsNotEmpty()
  @IsDateString()
  date_to: string;

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsString()
  major: string;

  @IsNotEmpty()
  @IsString()
  image_id: string;
}
