import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateTaskPositionDto {
  @IsNumber()
  @IsNotEmpty()
  position: number;
}
