import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../logger/index.js';
import {DatabaseClient} from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Trying to connect to MongoDB');
    try {
      await mongoose.connect(uri, {serverSelectionTimeoutMS: 5000});
      this.logger.info('Connection to MongoDB established');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Disconnected from MongoDB');
  }
}
