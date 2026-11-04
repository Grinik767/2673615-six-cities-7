import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {Component} from '../../types/index.js';
import {UserEntity, UserModel} from './user.entity.js';
import {UserService} from './user-service.interface.js';
import {DefaultUserService} from './default-user.service.js';

export function createUserContainer(): Container {
  const container = new Container();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  return container;
}
