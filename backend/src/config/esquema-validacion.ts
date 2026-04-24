import Joi from 'joi';

// Variables validadas al arranque. Cada tarea suma las suyas:
//   1.1  → NODE_ENV, PORT, API_PREFIX, FRONTEND_URL, DATABASE_URL
//   1.3  → JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES
//   1.10 → REDIS_HOST, REDIS_PORT, THROTTLE_TTL, THROTTLE_LIMIT
// Mapbox, SMTP, MinIO, Firebase, WhatsApp se añaden cuando su tarea llega.
export const esquemaValidacionEnv = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  FRONTEND_URL: Joi.string().optional().allow(''),
  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});
