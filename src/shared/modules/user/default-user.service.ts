import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {UserService} from './user-service.interface.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {UpdateFavoriteDto} from './dto/update-favorite.dto.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity();
    Object.assign(user, dto);
    user.setPassword(dto.password, salt);
    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${result.id}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = await this.findByEmail(dto.email);
    return user ?? await this.create(dto, salt);
  }

  public async updateById(id: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, {$set: dto}, {new: true}).exec();
  }

  public async findFavorites(id: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(id)
      .populate<{favorites: DocumentType<OfferEntity>[]}>({
        path: 'favorites',
        populate: {path: 'author'},
        options: {sort: {publicationDate: -1, _id: -1}},
      })
      .exec();
    return user?.favorites ?? [];
  }

  public async updateFavorite(id: string, dto: UpdateFavoriteDto): Promise<DocumentType<UserEntity> | null> {
    if (dto.isFavorite && !await this.offerModel.exists({_id: dto.offerId})) {
      return null;
    }
    const update = dto.isFavorite
      ? {$addToSet: {favorites: dto.offerId}}
      : {$pull: {favorites: dto.offerId}};
    return this.userModel.findByIdAndUpdate(id, update, {new: true}).exec();
  }
}
