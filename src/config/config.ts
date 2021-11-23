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
    API_PORT: yup.number().default(3001),
    PUBLIC_URL: yup.string().default('localhost'),
    USE_DATABASE: yup.boolean().default(false),
    DB_HOST: yup.string().required('DB URL'),
    DB_USER: yup.string().required('DB User'),
    DB_PASS: yup.string().required('DB Password'),
    SALT_WORK_FACTOR: yup.number().default(10),
    ACCESS_TOKEN_TTL: yup.string().default('15m'),
    REFRESH_TOKEN_TTL: yup.string().default('1y'),
    PRIVATE_KEY: yup.string().default(''),
    PUBLIC_KEY: yup.string().default(''),
    // NODEMAILER_HOST: yup
    //   .string()
    //   .required('Host do serviço de envio de e-mails não informado'),
    // NODEMAILER_PORT: yup
    //   .number()
    //   .required('Porta do serviço de envio de e-mails não informada'),
    // NODEMAILER_USER: yup
    //   .string()
    //   .required('Username do serviço de envio de e-mails não informado'),
    // NODEMAILER_PASSWORD: yup
    //   .string()
    //   .required('Password do serviço de envio de e-mails não informado'),
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
  useDatabase: envVars.USE_DATABASE,
  database: {
    url: `${envVars.DB_HOST}${envVars.NODE_ENV === 'test' ? '-test' : ''}`,
    options: {
      user: envVars.DB_USER,
      pass: envVars.DB_PASS,
      authSource: 'admin',
    },
  },
  saltWorkFactor: envVars.SALT_WORK_FACTOR,
  accessTokenTtl: envVars.ACCESS_TOKEN_TTL,
  refreshTokenTtl: envVars.REFRESH_TOKEN_TTL,
  privateKey: envVars.PRIVATE_KEY,
  publicKey: envVars.PUBLIC_KEY,
  // email: {
  //   sender: 'noreply@projeto.com.br',
  //   administration: envVars.EMAIL_ADMINISTRACAO,
  //   smtp: {
  //     host: envVars.NODEMAILER_HOST,
  //     port: envVars.NODEMAILER_PORT,
  //     auth: {
  //       user: envVars.NODEMAILER_USER,
  //       pass: envVars.NODEMAILER_PASSWORD,
  //     },
  //   },
  // },
};

export default config;
