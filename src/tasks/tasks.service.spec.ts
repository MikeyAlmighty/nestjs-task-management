import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TASK_STATUS } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
});

const mockUser = {
  username: 'John Doe',
  id: '112eww-123ewdad',
  password: 'secretPassword',
  tasks: [],
}

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async() => {
    // Initialize NestJS module
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository }
      ],
    }).compile();
    tasksService = await module.get(TasksService)
    tasksRepository= await module.get(TasksRepository)
  })

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async() => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser)
      expect(result).toEqual('someValue');
    })
  });
  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test Title',
        description: 'Test Description',
        id: 'someId',
        status: TASK_STATUS.OPEN,
      }
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(null, mockUser)
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException)
    })
  });
});