import {User} from '../../../types/index.js';

export class CreateUserDto implements User {
  public name!: string;
  public email!: string;
  public avatar?: string;
  public password!: string;
  public type!: User['type'];
}
