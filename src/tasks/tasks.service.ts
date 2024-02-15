import { Injectable, NotFoundException } from '@nestjs/common';
import { TASK_STATUS } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TasksRepository) private taskRepository: TasksRepository) {}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task>{
    const found = await this.taskRepository.findOne({ where: { id }});
    if (!found){
      throw new NotFoundException(`Task with id: ${id} not found!`);
    } else {
      return found;
    }
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  deleteTask(id: string) {
    return this.taskRepository.deleteTask(id);
  }

  async updateTaskStatus(id: string, status: TASK_STATUS): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);
    return task
  }

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     });
  //   }
  //   return tasks;
  // }
}
