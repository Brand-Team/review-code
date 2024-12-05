import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities';

interface MockRepository {
  find: jest.Mock<Promise<Task[]>>;
  findOne: jest.Mock<Promise<Task | null>>;
  save: jest.Mock<Promise<Task>>;
  create: jest.Mock<Task>;
  update: jest.Mock<Promise<boolean>>;
  delete: jest.Mock<Promise<boolean>>;
}
describe('TaskController', () => {
  let controller: TaskController;
  const mockRepository: MockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockImplementation((entity: Task) => Promise.resolve({ id: 1, ...entity })),
    create: jest.fn().mockImplementation((dto: Partial<Task>) => ({ id: 1, ...dto })),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        }
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
