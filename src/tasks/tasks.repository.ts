import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TASK_STATUS } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const {
      title,
      description
    } = createTaskDto;

    const task: Task = this.create({
      title,
      description,
      status: TASK_STATUS.OPEN
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found`)
    }
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
     query.andWhere('task.status = :status', { status });
    }

    if (search) {
     query.andWhere(
       'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
       {
          search: `%${search}%`
       });
    }
    return await query.getMany();
  }
}