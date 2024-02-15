import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TASK_STATUS } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TasksRepository) private taskRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task>{
    const found = await this.taskRepository.findOne({ where: { id, user }});
    if (!found){
      throw new NotFoundException(`Task with id: ${id} not found!`);
    } else {
      return found;
    }
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  deleteTask(id: string, user: User) {
    return this.taskRepository.deleteTask(id, user);
  }

  async updateTaskStatus(id: string, status: TASK_STATUS, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.taskRepository.save(task);
    return task
  }
}
