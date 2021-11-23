import jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../config/logger';

const privateKey = Buffer.from(config.privateKey, 'base64').toString('ascii');
const publicKey = Buffer.from(config.publicKey, 'base64').toString('ascii');

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    logger.error(e);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
