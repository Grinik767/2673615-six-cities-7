import {DocumentType} from '@typegoose/typegoose';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {UpdateFavoriteDto} from './dto/update-favorite.dto.js';

export interface UserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
  findFavorites(id: string): Promise<DocumentType<OfferEntity>[]>;
  updateFavorite(id: string, dto: UpdateFavoriteDto): Promise<DocumentType<UserEntity> | null>;
}
