import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Role } from '../../common/enums';

export class AddMemberDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
