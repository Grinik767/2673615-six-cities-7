import convict from 'convict';
import {config} from 'dotenv';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../logger/index.js';
import {Config} from './config.interface.js';
import {configRestSchema, RestSchema} from './rest.schema.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Cannot read .env file. Create it using .env-example.');
    }

    const restConfig = convict(configRestSchema, {args: []});
    restConfig.validate({allowed: 'strict'});
    this.config = restConfig.getProperties();
    this.logger.info('.env file found and successfully parsed');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
