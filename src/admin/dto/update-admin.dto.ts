import { IsOptional, IsStrongPassword, IsEmail } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsStrongPassword()
  password: string;
}
