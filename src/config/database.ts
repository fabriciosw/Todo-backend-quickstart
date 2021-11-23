import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

async function database() {
  try {
    const { url, options } = config.database;
    await mongoose.connect(url, options);
    logger.info('DB connected');
  } catch (error) {
    logger.error('Could not connect to db');
    process.exit(1);
  }
}

export default database;
