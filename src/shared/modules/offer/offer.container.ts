import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {Component} from '../../types/index.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {DefaultOfferService} from './default-offer.service.js';

export function createOfferContainer(): Container {
  const container = new Container();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  return container;
}
