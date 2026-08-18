import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProjectStatus } from '../../common/enums';

export class UpdateProjectStatusDto {
  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  status: ProjectStatus;
}
