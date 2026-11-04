import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Types} from 'mongoose';
import {City, Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CommentEntity} from '../comment/comment.entity.js';
import {UserEntity} from '../user/user.entity.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferEntity} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {DEFAULT_OFFER_COUNT, MAX_PREMIUM_OFFER_COUNT, RATING_PRECISION} from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, rating: 0, commentCount: 0});
    this.logger.info(`New offer created: ${result.id}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).populate('author').exec();
  }

  public async find(count = DEFAULT_OFFER_COUNT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find()
      .sort({publicationDate: -1, _id: -1})
      .limit(count)
      .populate('author')
      .exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({city, isPremium: true})
      .sort({publicationDate: -1, _id: -1})
      .limit(MAX_PREMIUM_OFFER_COUNT)
      .populate('author')
      .exec();
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, {$set: dto}, {new: true})
      .populate('author')
      .exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findByIdAndDelete(id).exec();
    if (offer) {
      await this.commentModel.deleteMany({offerId: id}).exec();
      await this.userModel.updateMany({favorites: id}, {$pull: {favorites: id}}).exec();
    }
    return offer;
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: id})) !== null;
  }

  public async isAuthor(id: string, userId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: id, author: userId})) !== null;
  }

  public async updateCommentStats(id: string): Promise<DocumentType<OfferEntity> | null> {
    const [stats] = await this.commentModel.aggregate<{rating: number; count: number}>([
      {$match: {offerId: new Types.ObjectId(id)}},
      {$group: {_id: '$offerId', rating: {$avg: '$rating'}, count: {$sum: 1}}},
    ]).exec();
    const update = stats
      ? {rating: Math.round(stats.rating * RATING_PRECISION) / RATING_PRECISION, commentCount: stats.count}
      : {rating: 0, commentCount: 0};
    return this.offerModel.findByIdAndUpdate(id, {$set: update}, {new: true}).exec();
  }
}
