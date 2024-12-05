import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    isAdmin: false,
    password: '$2a$12$65lpuFP12wzFHEnobGlMd.LjMZgakm.GD3nfDflBon/cu66tRzzCS',
    isActive: false,
    assignedTasks: [],
    ownedTask: [],
  };
  const correctPassword = '12345678';
  const incorrectPassword = 'wrongPassword';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn() as jest.Mock,
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return JWT token when valid credentials provided', async () => {
    const { id, email, username, isAdmin, password } = mockUser;
    const mockPayload = { id, mail: email, username, isAdmin };
    const mockToken = 'jwt.token.mock';
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
    const params = { email, password: correctPassword };
    const result = await authService.validateUser(params);

    expect(result).toBe(mockToken);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(jwtService.sign).toHaveBeenCalledWith(mockPayload);
  });

  it('should throw UnauthorizedException when user email not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(authService.validateUser({
      email: 'nonexistent@test.com',
      password: incorrectPassword
    })).rejects.toThrow(new UnauthorizedException('No such user'));

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'nonexistent@test.com' }
    });
  });

  it('should return true when password matches', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const params = { email: 'test@test.com', password: correctPassword };
    const mockToken = 'jwt.token.mock';
    jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
    const result = await authService.validateUser(params);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
    expect(result).toBeTruthy();
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    const params = { email: 'test@test.com', password: incorrectPassword };
    await expect(authService.validateUser(params)).rejects.toThrow(UnauthorizedException);
    expect(bcrypt.compare).toHaveBeenCalledWith(params.password, mockUser.password);
  });

  it('should throw UnauthorizedException when email or password is empty', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    await expect(authService.validateUser({ email: '', password: 'password123' }))
      .rejects
      .toThrow(UnauthorizedException);

    await expect(authService.validateUser({ email: 'test@test.com', password: '' }))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(authService.validateUser({
      email: 'nonexistent@test.com',
      password: incorrectPassword
    })).rejects.toThrow(UnauthorizedException);

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'nonexistent@test.com' }
    });
  });

  it('should throw UnauthorizedException when bcrypt compare fails', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.validateUser({
      email: 'test@test.com',
      password: 'wrongpassword'
    })).rejects.toThrow(UnauthorizedException);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
  });

  it('should throw an error when repository connection times out', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Connection timeout'));

    await expect(authService.validateUser({
      email: 'test@test.com',
      password: correctPassword
    })).rejects.toThrow('Connection timeout');

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' }
    });
  });
});
