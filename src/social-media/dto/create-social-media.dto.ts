import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialMediaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsString()
  image_id: string;
}
