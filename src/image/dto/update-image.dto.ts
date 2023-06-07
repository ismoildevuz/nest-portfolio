import { IsOptional, IsString } from "class-validator";

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  file_name?: string;
}
