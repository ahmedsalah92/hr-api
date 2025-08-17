import * as Joi from 'joi';

export const authEnvSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().default('900s'),
  JWT_REFRESH_TTL: Joi.string().default('2592000s'),
  PASSWORD_RESET_TTL: Joi.string().default('3600s'),
  RATE_LIMIT_LOGIN_WINDOW: Joi.number().integer().default(60000),
  RATE_LIMIT_LOGIN_MAX: Joi.number().integer().default(5),
  RATE_LIMIT_FORGOT_WINDOW: Joi.number().integer().default(3600000),
  RATE_LIMIT_FORGOT_MAX: Joi.number().integer().default(5),
  MFA_ISSUER: Joi.string().default('HR API'),
  MFA_TOTP_WINDOW: Joi.number().integer().default(1),
  MFA_ENC_KEY: Joi.string().base64().length(44).required(), // 32-byte base64
  APP_PUBLIC_URL: Joi.string().uri().required(),
  FAILED_LOGIN_LOCK_THRESHOLD: Joi.number().integer().default(10),
  FAILED_LOGIN_LOCK_DURATION: Joi.number()
    .integer()
    .default(30 * 60 * 1000),
  REFRESH_DEVICE_LIMIT: Joi.number().integer().default(10),
  BOOTSTRAP_TOKEN: Joi.string().optional(),
  TRUST_PROXY: Joi.boolean().default(false),
});

export type AuthEnv = {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TTL: string;
  JWT_REFRESH_TTL: string;
  PASSWORD_RESET_TTL: string;
  RATE_LIMIT_LOGIN_WINDOW: number;
  RATE_LIMIT_LOGIN_MAX: number;
  RATE_LIMIT_FORGOT_WINDOW: number;
  RATE_LIMIT_FORGOT_MAX: number;
  MFA_ISSUER: string;
  MFA_TOTP_WINDOW: number;
  MFA_ENC_KEY: string;
  APP_PUBLIC_URL: string;
  FAILED_LOGIN_LOCK_THRESHOLD: number;
  FAILED_LOGIN_LOCK_DURATION: number;
  REFRESH_DEVICE_LIMIT: number;
  BOOTSTRAP_TOKEN?: string;
  TRUST_PROXY: boolean;
};
