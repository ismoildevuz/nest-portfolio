import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto {
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @IsOptional()
  @IsDateString()
  date_to?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  major?: string;
}
