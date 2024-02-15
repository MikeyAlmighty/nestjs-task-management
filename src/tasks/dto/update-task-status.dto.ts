import { TASK_STATUS } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsEnum(TASK_STATUS)
  status: TASK_STATUS
}