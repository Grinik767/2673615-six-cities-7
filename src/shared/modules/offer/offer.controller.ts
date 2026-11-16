import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {BaseController, HttpError, HttpMethod, RequestBody, RequestParams} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {City, Component} from '../../types/index.js';
import {fillDTO} from '../../helpers/index.js';
import {OfferService} from './offer-service.interface.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {OfferPreviewRdo} from './rdo/offer-preview.rdo.js';

type OfferParams = {offerId: string};
type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
type UpdateOfferRequest = Request<OfferParams, RequestBody, UpdateOfferDto>;

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.premium});
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.favorites});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.addFavorite});
    this.addRoute({path: '/:offerId/favorite', method: HttpMethod.Delete, handler: this.removeFavorite});
  }

  public async index(req: Request<RequestParams, RequestBody, unknown, {limit?: string}>, res: Response): Promise<void> {
    const offers = await this.offerService.find(req.query.limit === undefined ? undefined : Number(req.query.limit));
    this.ok(res, fillDTO(OfferPreviewRdo, offers.map((offer) => offer.toObject({virtuals: true}))));
  }

  public async premium(req: Request<RequestParams, RequestBody, unknown, {city: City}>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(req.query.city);
    this.ok(res, fillDTO(OfferPreviewRdo, offers.map((offer) => offer.toObject({virtuals: true}))));
  }

  public async show({params}: Request<OfferParams>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'OfferController');
    }
    this.ok(res, fillDTO(OfferRdo, offer.toObject({virtuals: true})));
  }

  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer.toObject({virtuals: true})));
  }

  public async update({params, body}: UpdateOfferRequest, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'OfferController');
    }
    this.ok(res, fillDTO(OfferRdo, offer.toObject({virtuals: true})));
  }

  public async delete({params}: Request<OfferParams>, res: Response): Promise<void> {
    if (!await this.offerService.deleteById(params.offerId)) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'OfferController');
    }
    this.noContent(res);
  }

  public favorites(_req: Request, _res: Response): void {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public addFavorite(_req: Request, _res: Response): void {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }

  public removeFavorite(_req: Request, _res: Response): void {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'OfferController');
  }
}
