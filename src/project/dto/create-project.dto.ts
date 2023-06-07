import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  link_project: string;

  @IsNotEmpty()
  @IsString()
  link_github: string;

  @IsNotEmpty()
  @IsString()
  image_id: string;
}
