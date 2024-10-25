import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import * as moment from 'moment';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // if (Array.isArray(exception.message)) {
    //   console.log(); // Join array elements if needed
    // } else {
    //   console.log(exception.message);
    // }
    const { response: res } = exception;
    const [message] = res?.message;
    console.log(res?.message)

    const exceptionMessage =
      exception.message || 'An unexpected error occurred';

    // Format datetime - file - line - input<Optional> - exception_message
    const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const file = exception.stack ? exception.stack.split('\n')[1].trim() : 'unknown';
    const line = exception.stack ? exception.stack.split('\n')[2].trim() : 'unknown';
    const input = request.body || {};

    const formattedLog = `${datetime} - ${file} - ${line} - input: ${JSON.stringify(
      input,
    )} - exception_message: ${exceptionMessage}`;

    // console.error(formattedLog);

    // Respond to the client with a generic error message
    httpAdapter.reply(
      response,
      {
        statusCode,
        error: message
      },
      statusCode,
    );
  }
}
