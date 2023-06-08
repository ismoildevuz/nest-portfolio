import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
