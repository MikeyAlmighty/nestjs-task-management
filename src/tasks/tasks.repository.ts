import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_STATUS } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { filter } from 'rxjs';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
  private logger = new Logger('TasksRepository', { timestamp: true })
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description
    } = createTaskDto;

    const task: Task = this.create({
      title,
      description,
      status: TASK_STATUS.OPEN,
      user
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.delete({ id, user })
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`)
    }
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user })

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
     query.andWhere(
       '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
       {
          search: `%${search}%`
       });
    }
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(`Failed to get tasks for user: "${user.username}". Filters: ${JSON.stringify(filterDto)}.`, error);
      throw new InternalServerErrorException();
    }
  }
}