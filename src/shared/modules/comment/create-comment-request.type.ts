import {Request} from 'express';
import {RequestBody} from '../../libs/rest/index.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

export type CreateCommentRequest = Request<
  {offerId: string},
  RequestBody,
  Omit<CreateCommentDto, 'offerId'>
>;
