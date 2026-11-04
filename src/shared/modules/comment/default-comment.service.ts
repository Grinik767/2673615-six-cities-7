import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {OfferService} from '../offer/offer-service.interface.js';
import {CommentEntity} from './comment.entity.js';
import {CommentService} from './comment-service.interface.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {MAX_COMMENT_COUNT} from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    if (!await this.offerService.exists(dto.offerId)) {
      throw new Error(`Offer not found: ${dto.offerId}`);
    }
    const comment = await this.commentModel.create(dto);
    await this.offerService.updateCommentStats(dto.offerId);
    return comment.populate('author');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId})
      .sort({publicationDate: -1, _id: -1})
      .limit(MAX_COMMENT_COUNT)
      .populate('author')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({offerId}).exec();
    await this.offerService.updateCommentStats(offerId);
    return result.deletedCount;
  }
}
