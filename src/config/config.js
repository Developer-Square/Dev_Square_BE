const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    MONGODB_ATLAS_URL: Joi.string().required().description('Mongo DB Atlas url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    ADMIN_NAME: Joi.string().required().default('admin').description('initial admin username'),
    ADMIN_PASSWORD: Joi.string().required().default('admin1234').description('initial admin password'),
    ADMIN_EMAIL: Joi.string().required().default('admin@example.com').description('initial admin email'),
    ADMIN_ROLE: Joi.string().required().default('admin').description('admin role'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const changeMongoUrl = () => {
  switch (envVars.NODE_ENV) {
    case 'test':
      // eslint-disable-next-line prefer-template
      return envVars.MONGODB_URL + '-test';
    case 'production':
      return envVars.MONGODB_ATLAS_URL;
    case 'development':
      return envVars.MONGODB_URL;
    default:
      return envVars.MONGODB_URL;
  }
};

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    // url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    url: changeMongoUrl(),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
    url: envVars.NODE_ENV === 'production' ? `http://localhost:3000/reset/password` : `http://localhost:3000/reset/password`,
  },
  admin: {
    name: envVars.ADMIN_NAME,
    email: envVars.ADMIN_EMAIL,
    password: envVars.ADMIN_PASSWORD,
    role: envVars.ADMIN_ROLE,
  },
};
