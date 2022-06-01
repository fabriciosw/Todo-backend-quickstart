import { EntityRepository, Repository } from 'typeorm';
import { decode } from 'jsonwebtoken';
import AppError from '../../utils/AppError';
import Task from '../entities/Task';

@EntityRepository(Task)
export default class TaskRepository extends Repository<Task> {
  public getUserOnPayload(authHeader: string | undefined) {
    if (!authHeader) {
      throw new AppError('JWT Token is missing.');
    }

    const [, token] = authHeader.split(' ');

    const payload = decode(token, {
      json: true,
    });

    if (!payload) {
      throw new AppError('JWT token invalid');
    }
    if (!payload.sub) {
      throw new AppError('JWT token invalid');
    }

    const userId = parseInt(payload.sub, 10);

    return userId;
  }
}
