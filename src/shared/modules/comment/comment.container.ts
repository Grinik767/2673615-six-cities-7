import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {Component} from '../../types/index.js';
import {CommentEntity, CommentModel} from './comment.entity.js';
import {CommentService} from './comment-service.interface.js';
import {DefaultCommentService} from './default-comment.service.js';

export function createCommentContainer(): Container {
  const container = new Container();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  return container;
}
