import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../common/enums';

export class UpdateMemberRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
