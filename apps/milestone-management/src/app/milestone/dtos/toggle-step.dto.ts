import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class ToggleStepDto {
  @IsString()
  @Expose()
  milestoneId: string;

  @IsString()
  @Expose()
  stepId: string;

  @IsBoolean()
  @Expose()
  completed: boolean;
}
