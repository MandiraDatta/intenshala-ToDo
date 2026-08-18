import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray, IsUUID, MaxLength } from 'class-validator';
import { TaskStatus, Priority } from '../../common/enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  description?: string;

  @IsUUID()
  @IsOptional()
  projectId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.NONE;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsUUID()
  @IsOptional()
  reporterId?: string;

  @IsUUID()
  @IsOptional()
  teamId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  memberIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  labelIds?: string[];
}
