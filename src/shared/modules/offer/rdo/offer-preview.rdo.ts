import {Expose, Transform} from 'class-transformer';
import {City, HousingType} from '../../../types/index.js';

export class OfferPreviewRdo {
  @Expose()
  public id!: string;

  @Expose()
  public price!: number;

  @Expose()
  public title!: string;

  @Expose()
  public housingType!: HousingType;

  @Expose()
  @Transform(({value}) => value ?? false)
  public isFavorite!: boolean;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentCount!: number;
}
