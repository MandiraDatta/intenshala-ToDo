import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateProjectPositionDto {
  @IsNumber()
  @IsNotEmpty()
  position: number;
}
