import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Request } from 'express';
import { BadRequestException, Body, CanActivate, ExecutionContext, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserGuard } from './guards/user.guard';
import { ExceptionHandler } from 'winston';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    let validationPipe: ValidationPipe;

    beforeEach(() => {
      validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    });

    it('should return user data with 200 status when credentials are valid', async () => {
      const mockUser = 'token.mock';
      const mockRequest = {
        user: mockUser,
      } as unknown as Request;
      const expectedResponse = {
        data: mockUser,
        status: 200,
        message: 'success'
      };
      jest.spyOn(authController, 'baseResponse').mockReturnValue(expectedResponse);
      const result = await authController.login(mockRequest);
      expect(authController.baseResponse).toHaveBeenCalledWith({
        data: mockRequest?.user,
        status: 200
      });
      expect(result.data).toEqual(mockRequest?.user);
      expect(result.status).toBe(200);
    });

    it('should validate AuthPayloadDto and return user data with 200 status', async () => {
      const validPayload: AuthPayloadDto = { email: 'valid@test.com', password: '12345678' };
      const expectedResponse = { data: validPayload, status: 200, message: 'success' };
      const request = {
        user: 'token.mock',
        body: validPayload,
      } as unknown as Request;
      jest.spyOn(authController, 'baseResponse').mockReturnValue(expectedResponse);
      const result = await validationPipe.transform(request.body, {
        type: 'body',
        metatype: AuthPayloadDto,
      });
      expect(result).toEqual(validPayload);
      const res = await authController.login(request);
      expect(authController.baseResponse).toHaveBeenCalledWith({
        data: request?.user,
        status: 200
      });
      expect(res).toEqual(expectedResponse);
    });

    it('should return validation error when email and password is missing', async () => {
      const mockRequest = { body: {} } as Request;
      try {
        await validationPipe.transform(mockRequest.body, {
          type: 'body',
          metatype: AuthPayloadDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: 'Bad Request',
          statusCode: 400,
          message: ['email should not be empty', 'password should not be empty'],
        })
      }
    });

    it('should return validation error when email is missing', async () => {
      const mockRequest = { body: { password: '12345678' } } as Request;
      try {
        await validationPipe.transform(mockRequest.body, {
          type: 'body',
          metatype: AuthPayloadDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: 'Bad Request',
          statusCode: 400,
          message: ['email should not be empty'],
        })
      }
    });

    it('should return validation error when password is missing', async () => {
      const mockRequest = { body: { email: 'valid@test.com' } } as Request;
      try {
        await validationPipe.transform(mockRequest.body, {
          type: 'body',
          metatype: AuthPayloadDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toEqual({
          error: 'Bad Request',
          statusCode: 400,
          message: ['password should not be empty'],
        })
      }
    });
  });

  describe('Get current user profile', () => {
    it('should return user data if authorized', () => {
      const mockUser = {
        id: 1,
        useremail: "taobietladu@gmail.com",
        username: "brand",
        isAdmin: false,
        iat: 1733284113,
        exp: 1733370513
      };
      const mockReq = { user: mockUser } as unknown as Request;
      const response = authController.status(mockReq);
      expect(response).toEqual({
        data: mockReq.user,
        status: 200,
        message: 'Success'
      });
    });
  });
});
