import { getCustomRepository } from 'typeorm';
import { Request, Response } from 'express';
import AppError from '../utils/AppError';
import TaskRepository from '../database/repositories/TasksRepository';

export default class TasksController {
  public async getAll(request: Request, response: Response): Promise<Response> {
    const tasksRepository = getCustomRepository(TaskRepository);

    const authHeader = request.headers.authorization;

    const user = tasksRepository.getUserOnPayload(authHeader);

    try {
      const products = await tasksRepository.find({
        where: { user_id: user },
      });
      return response.json(products);
    } catch (error) {
      return response.json(error);
    }
  }

  public async endTask(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id } = request.params;

    const tasksRepository = getCustomRepository(TaskRepository);

    const task = await tasksRepository.findOne(id);

    if (!task) {
      throw new AppError('Task not found.');
    }

    await tasksRepository.update(task.id, { complete: true });

    return response.json('completada');
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;
    const complete = false;
    const tasksRepository = getCustomRepository(TaskRepository);

    const authHeader = request.headers.authorization;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const user_id = tasksRepository.getUserOnPayload(authHeader);

    const task = tasksRepository.create({
      title,
      description,
      complete,
      user_id,
    });

    await tasksRepository.save(task);

    return response.json(task);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const tasksRepository = getCustomRepository(TaskRepository);

    const task = await tasksRepository.findOne(id);

    if (!task) {
      throw new AppError('Task not found.');
    }

    await tasksRepository.remove(task);

    return response.json([]);
  }
}
