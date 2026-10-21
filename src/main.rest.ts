import 'reflect-metadata';
import process from 'node:process';
import {Container} from 'inversify';
import {RestApplication} from './rest/index.js';
import {Config, RestConfig, RestSchema} from './shared/libs/config/index.js';
import {Logger, PinoLogger} from './shared/libs/logger/index.js';
import {Component} from './shared/types/index.js';

function bootstrap(): void {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const logger = container.get<Logger>(Component.Logger);

  try {
    const application = container.get<RestApplication>(Component.RestApplication);
    application.init();
  } catch (error: unknown) {
    logger.error('Failed to initialize application', error instanceof Error ? error : new Error(String(error)));
    process.exitCode = 1;
  }
}

bootstrap();
