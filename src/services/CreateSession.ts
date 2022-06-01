import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import config from '../config/config';
import UsersRepository from '../database/repositories/UsersRepository';
import AppError from '../utils/AppError';

interface IRequest {
  email: string;
  password: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<string> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await compare(password, user.senha);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    if (!config.jwtSecret)
      throw new AppError('Não há um jwtSecret definido na env');

    const token = sign({}, config.jwtSecret, {
      subject: `${user.id}`,
      expiresIn: config.accessTokenTtl,
    });

    return token;
  }
}

export default CreateSessionsService;
