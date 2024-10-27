import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import * as morgan from 'morgan'
import logger from 'src/logger'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const customFormat = morgan((tokens, req: Request, res: Response) => {
      const datetime = tokens.date(req, res, 'iso');
      const method = tokens.method(req, res);
      const uri = tokens.url(req, res);
      const status = tokens.status(req, res);
      const userAgent = req.headers['user-agent'] || req.ip;
      const headers = JSON.stringify(req.headers);
      const body = JSON.stringify(req.body);
      const query = JSON.stringify(req.query);

      return `${datetime} - ${method} - ${uri} - ${status} - ${userAgent} - params: { headers: ${headers}, body: ${body}, query: ${query} }`;
    }, {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    });

    customFormat(req, res, next);
  }
}