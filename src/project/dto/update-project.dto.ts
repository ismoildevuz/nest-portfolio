import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  link_project?: string;

  @IsOptional()
  @IsString()
  link_github?: string;

  @IsOptional()
  @IsString()
  image_id?: string;
}
