import 'reflect-metadata';
import process from 'node:process';
import {createRestApplicationContainer, RestApplication} from './rest/index.js';
import {Logger} from './shared/libs/logger/index.js';
import {Component} from './shared/types/index.js';

async function bootstrap(): Promise<void> {
  const container = createRestApplicationContainer();
  const logger = container.get<Logger>(Component.Logger);

  try {
    const application = container.get<RestApplication>(Component.RestApplication);
    await application.init();
  } catch (error: unknown) {
    logger.error('Failed to initialize application', error instanceof Error ? error : new Error(String(error)));
    process.exitCode = 1;
  }
}

void bootstrap();
