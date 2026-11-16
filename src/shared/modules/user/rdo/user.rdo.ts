import {Expose, Transform} from 'class-transformer';
import {User} from '../../../types/index.js';

export class UserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  @Transform(({value}) => value ?? '/static/default-avatar.png')
  public avatar!: string;

  @Expose()
  public type!: User['type'];
}
