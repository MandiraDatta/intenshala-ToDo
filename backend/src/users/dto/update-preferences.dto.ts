import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdatePreferencesDto {
  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;

  @IsString()
  @IsOptional()
  @IsIn(['emerald', 'blue', 'purple', 'amber', 'rose', 'default'])
  colorMode?: string;
}
