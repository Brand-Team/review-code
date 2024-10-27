import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isArray } from 'class-validator';
import * as moment from 'moment';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let exceptionMessage: string;

    const { response: res } = exception;

    if (isArray(exception?.response?.message)) {
      const [message] = res?.message;
      exceptionMessage = message
    } else if (exception?.response?.message) {
      exceptionMessage = exception.response.message
    } else {
      exceptionMessage = exception.response
    }

    console.log(exception)

    const formattedLog = {
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      file: exception.stack ? exception.stack.split('\n')[1].trim() : 'unknown',
      line: exception.stack ? exception.stack.split('\n')[2].trim() : 'unknown',
      input: request.body ? request.body : {},
      message: exceptionMessage,
    };

    // Respond to the client with a generic error message
    httpAdapter.reply(
      response,
      {
        statusCode,
        error: formattedLog
      },
      statusCode,
    );
  }
}
