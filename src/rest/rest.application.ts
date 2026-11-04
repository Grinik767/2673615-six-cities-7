import {inject, injectable} from 'inversify';
import {Config, RestSchema} from '../shared/libs/config/index.js';
import {Logger} from '../shared/libs/logger/index.js';
import {Component} from '../shared/types/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

  public async init(): Promise<void> {
    await this.databaseClient.connect(getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    ));
    this.logger.info('Application initialized');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
