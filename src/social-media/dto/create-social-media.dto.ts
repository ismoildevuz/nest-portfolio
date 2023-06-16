import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialMediaDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  link: string;
}
