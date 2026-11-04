import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {Amenity, City, Coordinates, HousingType} from '../../types/index.js';
import {UserEntity} from '../user/user.entity.js';

export interface OfferEntity extends defaultClasses.Base {}

class OfferCoordinates implements Coordinates {
  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

@modelOptions({schemaOptions: {collection: 'offers', timestamps: true}})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public title!: string;

  @prop({required: true})
  public description!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({required: true, type: () => String})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true, type: () => [String]})
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({default: 0})
  public rating!: number;

  @prop({required: true, type: () => String})
  public housingType!: HousingType;

  @prop({required: true})
  public rooms!: number;

  @prop({required: true})
  public guests!: number;

  @prop({required: true})
  public price!: number;

  @prop({required: true, type: () => [String]})
  public amenities!: Amenity[];

  @prop({required: true, ref: () => UserEntity})
  public author!: Ref<UserEntity>;

  @prop({default: 0})
  public commentCount!: number;

  @prop({required: true, type: () => OfferCoordinates, _id: false})
  public coordinates!: OfferCoordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
