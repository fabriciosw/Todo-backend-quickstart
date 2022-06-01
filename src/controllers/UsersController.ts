import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { CreateUserService } from '../services/users.service';
import AppError from '../utils/AppError';
import UserRepository from '../database/repositories/UsersRepository';

export default class UsersController {
  public async getUser(request: Request, response: Response) {
    const { email } = request.body;
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email inválido', 400);
    }

    return response.json(user);
  }

  public async createUser(request: Request, response: Response) {
    const { email, password } = request.body;
    const user = await CreateUserService(email, password);
    return response.json(user);
  }
}
