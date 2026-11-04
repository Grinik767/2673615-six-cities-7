import {DocumentType} from '@typegoose/typegoose';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {OfferEntity} from './offer.entity.js';
import {City} from '../../types/index.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  exists(id: string): Promise<boolean>;
  isAuthor(id: string, userId: string): Promise<boolean>;
  updateCommentStats(id: string): Promise<DocumentType<OfferEntity> | null>;
}
