import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferService} from '../offer/offer-service.interface.js';
import {UserService} from '../user/user-service.interface.js';
import {CommentService} from './comment-service.interface.js';
import {CommentRdo} from './rdo/comment.rdo.js';
import {CreateCommentRequest} from './create-comment-request.type.js';

type CommentParams = {offerId: string};

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);
    this.addRoute({path: '/:offerId/comments', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:offerId/comments', method: HttpMethod.Post, handler: this.create});
  }

  public async index({params}: Request<CommentParams>, res: Response): Promise<void> {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'CommentController');
    }
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments.map((comment) => comment.toObject({virtuals: true}))));
  }

  public async create({params, body}: CreateCommentRequest, res: Response): Promise<void> {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'CommentController');
    }
    if (!await this.userService.findById(body.author)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found', 'CommentController');
    }
    const comment = await this.commentService.create({
      text: body.text,
      rating: body.rating,
      author: body.author,
      offerId: params.offerId,
    });
    this.created(res, fillDTO(CommentRdo, comment.toObject({virtuals: true})));
  }
}
