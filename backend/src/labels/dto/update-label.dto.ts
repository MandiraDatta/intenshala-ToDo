import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLabelDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;
}
