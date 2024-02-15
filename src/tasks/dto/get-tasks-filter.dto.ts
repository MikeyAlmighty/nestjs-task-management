import { TASK_STATUS } from '../task-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TASK_STATUS)
  status?: TASK_STATUS;

  @IsOptional()
  @IsString()
  search?: string;
}