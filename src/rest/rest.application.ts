import {inject, injectable} from 'inversify';
import express, {Express} from 'express';
import {StatusCodes} from 'http-status-codes';
import {Config, RestSchema} from '../shared/libs/config/index.js';
import {Logger} from '../shared/libs/logger/index.js';
import {Component} from '../shared/types/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';
import {Controller, ExceptionFilter, HttpError} from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {}

  private async initDb(): Promise<void> {
    await this.databaseClient.connect(getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    ));
  }

  private initMiddleware(): void {
    this.server.use(express.json());
  }

  private initControllers(): void {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/offers', this.commentController.router);
  }

  private initExceptionFilters(): void {
    this.server.use((req, _res, next) => {
      next(new HttpError(StatusCodes.NOT_FOUND, `Route ${req.method} ${req.path} not found`));
    });
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initServer(): Promise<void> {
    const port = this.config.get('PORT');
    await new Promise<void>((resolve, reject) => {
      const httpServer = this.server.listen(port, resolve);
      httpServer.once('error', reject);
    });
    this.logger.info(`Server started on http://localhost:${port}`);
  }

  public async init(): Promise<void> {
    this.logger.info('Application initialization');
    await this.initDb();
    this.initMiddleware();
    this.initControllers();
    this.initExceptionFilters();
    await this.initServer();
  }
}
