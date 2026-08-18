import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EntityType, ViewType } from '../../common/enums';

export class UpdateViewPreferenceDto {
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsEnum(ViewType)
  @IsOptional()
  viewType?: ViewType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  visibleFields?: string[];
}
