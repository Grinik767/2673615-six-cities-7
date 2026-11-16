import {injectable} from 'inversify';
import {Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import {Logger} from '../../logger/index.js';
import {Controller} from './controller.interface.js';
import {Route} from '../types/route.interface.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router = Router();

  constructor(protected readonly logger: Logger) {}

  public get router(): Router {
    return this._router;
  }

  public addRoute(route: Route): void {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res.type('application/json').status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).end();
  }
}
