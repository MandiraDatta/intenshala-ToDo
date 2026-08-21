import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateInviteDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string = 'MEMBER';

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  projectId?: string;
}
