import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsDateString()
  date_from: string;

  @IsNotEmpty()
  @IsDateString()
  date_to: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  position: string;
}
