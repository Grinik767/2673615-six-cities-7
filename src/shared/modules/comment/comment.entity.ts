import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {OfferEntity} from '../offer/offer.entity.js';
import {UserEntity} from '../user/user.entity.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'comments', timestamps: true}})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text!: string;

  @prop({required: true})
  public rating!: number;

  @prop({default: () => new Date()})
  public publicationDate!: Date;

  @prop({required: true, ref: () => OfferEntity})
  public offerId!: Ref<OfferEntity>;

  @prop({required: true, ref: () => UserEntity})
  public author!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
