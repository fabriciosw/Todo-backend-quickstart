import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import config from '../config/config';
import AppError from '../utils/AppError';

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  const [, token] = authHeader.split(' ');

  try {
    if (!config.jwtSecret) {
      throw new AppError('Não há um jwtSecret configurado');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const decodedToken = verify(token, config.jwtSecret);

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT Token.');
  }
}
