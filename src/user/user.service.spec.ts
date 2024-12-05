import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities';

describe('UserService', () => {
  let service: UserService;
  const mockRepository = {
    find: jest.fn<Promise<User[]>, []>(),
    findOne: jest.fn<Promise<User | null>, [number]>(),
    save: jest.fn<Promise<User>, [Partial<User>]>(),
    create: jest.fn<User, [Partial<User>]>(),
    update: jest.fn<Promise<boolean>, [number, Partial<User>]>(),
    delete: jest.fn<Promise<boolean>, [number]>(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
