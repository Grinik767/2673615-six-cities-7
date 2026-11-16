import {inject, injectable} from 'inversify';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {Logger} from '../../logger/index.js';
import {Component} from '../../../types/index.js';
import {createErrorObject} from '../../../helpers/index.js';
import {HttpError} from '../errors/index.js';
import {ExceptionFilter} from './exception-filter.interface.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    this.logger.error(`${req.method} ${req.originalUrl}: ${error.message}`, error);

    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof HttpError) {
      res.status(error.httpStatusCode).json(createErrorObject(error.message));
      return;
    }

    // express.json() forwards parsing and body-size errors with an HTTP status.
    if ('status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
      res.status(error.status).json(createErrorObject(error.message));
      return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject('Internal server error'));
  }
}
