import {defaultClasses, getModelForClass, modelOptions, prop} from '@typegoose/typegoose';
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

  public setPassword(password: string, salt: string): void {
    this.password = createSHA256(password, salt);
  }

  public getPassword(): string {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
