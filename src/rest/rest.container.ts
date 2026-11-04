import {Container, interfaces} from 'inversify';
import {Config, RestConfig, RestSchema} from '../shared/libs/config/index.js';
import {Logger, PinoLogger} from '../shared/libs/logger/index.js';
import {Component} from '../shared/types/index.js';
import {DatabaseClient, MongoDatabaseClient} from '../shared/libs/database-client/index.js';
import {createUserContainer} from '../shared/modules/user/index.js';
import {createOfferContainer} from '../shared/modules/offer/index.js';
import {createCommentContainer} from '../shared/modules/comment/index.js';
import {RestApplication} from './rest.application.js';

export function createRestApplicationContainer(): interfaces.Container {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return Container.merge(container, createUserContainer(), createOfferContainer(), createCommentContainer());
}
