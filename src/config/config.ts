import dotenv from 'dotenv';
import * as yup from 'yup';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const environments = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  TEST: 'test',
  STAGING: 'staging',
};

const environmentsString = Object.values(environments);

const envVarsSchema = yup
  .object()
  .shape({
    NODE_ENV: yup
      .string()
      .oneOf(environmentsString)
      .default(environments.DEVELOPMENT),
    API_PORT: yup.number().default(3333),
    PUBLIC_URL: yup.string().default('localhost'),
    // MONGO_DB_HOST: yup.string(), // .required('MONGO_DB_HOST is required'),
    // MONGO_DB_USER: yup.string(), // .required('MONGO_DB_USER is required'),
    // MONGO_DB_PASSWORD: yup.string(), // .required('MONGO_DB_PASSWORD is required'),
    SALT_WORK_FACTOR: yup.number().default(10),
    ACCESS_TOKEN_TTL: yup.string().default('15m'),
    REFRESH_TOKEN_TTL: yup.string().default('1y'),
    JWT_SECRET: yup.string().required('Secret is required'),
    // GOOGLE_APPLICATION_CREDENTIALS: yup.string(),
    // GOOGLE_MAP_API_KEY: yup.string(),
    // MIXPANEL_TOKEN: yup.string(),
    // PAGARME_API_KEY: yup.string(),
    // PAGARME_CRIPTO_KEY: yup.string(),
    POSTGRES_HOST: yup.string().required('POSTGRES_HOST is required'),
    POSTGRES_PORT: yup.number().default(5432),
    POSTGRES_USER: yup.string().required('POSTGRES_USER is required'),
    POSTGRES_PASSWORD: yup.string().required('POSTGRES_PASSWORD is required'),
    POSTGRES_DB: yup.string().required('POSTGRES_DB is required'),
  })
  .noUnknown();

let envVars;

try {
  envVarsSchema.validateSync(process.env, { abortEarly: false });
  envVars = envVarsSchema.cast(process.env);
} catch ({ errors }) {
  throw new Error(`Config validation error: ${errors}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.API_PORT,
  publicUrl: envVars.PUBLIC_URL,
  // mongoDb: {
  //   url: `${envVars.MONGO_DB_HOST}${
  //     envVars.NODE_ENV === 'test' ? '-test' : ''
  //   }`,
  //   options: {
  //     user: envVars.MONGO_DB_USER,
  //     pass: envVars.MONGO_DB_PASSWORD,
  //     authSource: 'admin',
  //   },
  // },
  postgresDb: {
    host: envVars.POSTGRES_HOST,
    port: envVars.POSTGRES_PORT,
    username: envVars.POSTGRES_USER,
    password: envVars.POSTGRES_PASSWORD,
    database: envVars.POSTGRES_DB,
  },
  saltWorkFactor: envVars.SALT_WORK_FACTOR,
  accessTokenTtl: envVars.ACCESS_TOKEN_TTL,
  refreshTokenTtl: envVars.REFRESH_TOKEN_TTL,
  jwtSecret: envVars.JWT_SECRET,
  googleMapsKey: envVars.GOOGLE_MAP_API_KEY,
  mixPanelKey: envVars.MIXPANEL_TOKEN,
  pagarme: {
    key: envVars.PAGARME_API_KEY,
    criptoKey: envVars.PAGARME_CRIPTO_KEY,
  },
};

export default config;
