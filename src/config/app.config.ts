import { registerAs, ConfigType } from '@nestjs/config';
import * as Joi from 'joi';

export const AppEnvSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  CORS_ORIGINS: Joi.string().required(), // comma-separated
});

const appConfig = registerAs('app', () => ({
  env: process.env['NODE_ENV'] as 'development' | 'test' | 'production',
  port: Number(process.env['PORT'] ?? 3000),
  databaseUrl: process.env['DATABASE_URL'] as string,
  corsOrigins: (process.env['CORS_ORIGINS'] ?? '').split(',').filter(Boolean),
}));

export type AppConfigType = ConfigType<typeof appConfig>;
export default appConfig;
