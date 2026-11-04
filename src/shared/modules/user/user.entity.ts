import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import type {OfferEntity} from '../offer/offer.entity.js';
import {Types} from 'mongoose';
import {User} from '../../types/index.js';
import {createSHA256} from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'users', timestamps: true}})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true})
  public name!: string;

  @prop({required: true, unique: true})
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({required: true})
  public password!: string;

  @prop({required: true, type: () => String, enum: ['regular', 'pro']})
  public type!: User['type'];

  @prop({ref: 'OfferEntity', type: () => [Types.ObjectId], default: []})
  public favorites!: Ref<OfferEntity>[];

  public setPassword(password: string, salt: string): void {
    this.password = createSHA256(password, salt);
  }

  public getPassword(): string {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
