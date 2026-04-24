import Joi from 'joi';

export const esquemaValidacionEnv = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').required(),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  FRONTEND_URL: Joi.string().optional(),

  DATABASE_URL: Joi.string().required(),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  MAPBOX_TOKEN: Joi.string().required(),

  WHATSAPP_PHONE_NUMBER_ID: Joi.string().optional().allow(''),
  WHATSAPP_ACCESS_TOKEN: Joi.string().optional().allow(''),
  WHATSAPP_BUSINESS_ACCOUNT_ID: Joi.string().optional().allow(''),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: Joi.string().optional().allow(''),
  WHATSAPP_API_VERSION: Joi.string().default('v20.0'),

  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(1025),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASSWORD: Joi.string().optional().allow(''),
  SMTP_FROM_EMAIL: Joi.string().email().default('no-reply@delivery.com'),
  SMTP_FROM_NAME: Joi.string().default('Delivery System'),

  FIREBASE_PROJECT_ID: Joi.string().optional().allow(''),
  FIREBASE_PRIVATE_KEY: Joi.string().optional().allow(''),
  FIREBASE_CLIENT_EMAIL: Joi.string().optional().allow(''),

  MINIO_ENDPOINT: Joi.string().default('http://localhost:9000'),
  MINIO_REGION: Joi.string().default('us-east-1'),
  MINIO_ACCESS_KEY: Joi.string().required(),
  MINIO_SECRET_KEY: Joi.string().required(),
  MINIO_BUCKET_UPLOADS: Joi.string().default('delivery-uploads'),
  MINIO_PUBLIC_URL: Joi.string().default('http://localhost:9000/delivery-uploads'),

  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});
