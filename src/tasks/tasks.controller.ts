import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { Getuser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @Getuser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all Tasks. Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @Getuser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving task by ID: ${id}`)
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Getuser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto, user)
  }

  @Delete("/:id")
  deleteTaskById(@Param('id') id: string, @Getuser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting a task. TaskId: ${id}`)
    return this.tasksService.deleteTask(id, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @Getuser() user: User): Promise<Task> {
    const { status } = updateTaskStatusDto;
    this.logger.verbose(`User "${user.username}" updated task status to ${status}`)
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
