import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  SALT: string;
};

export const configRestSchema: convict.Schema<RestSchema> = {
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  DB_PORT: {
    doc: 'MongoDB port',
    format: 'port',
    env: 'DB_PORT',
    default: 27017
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  DB_USER: {
    doc: 'MongoDB username',
    format: String,
    env: 'DB_USER',
    default: null,
    sensitive: true
  },
  DB_PASSWORD: {
    doc: 'MongoDB password',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
    sensitive: true
  },
  SALT: {
    doc: 'Salt for password hashing',
    format: (value: unknown): void => {
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error('SALT must be a non-empty string');
      }
    },
    env: 'SALT',
    default: null,
    sensitive: true,
  },
};
