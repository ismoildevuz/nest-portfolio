import { IsOptional, IsString } from 'class-validator';

export class UpdateSocialMediaDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  link?: string;
}
