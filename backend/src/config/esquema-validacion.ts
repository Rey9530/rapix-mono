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

  // Fase 6 — Notificaciones (todas opcionales: el adapter degrada
  // a FALLIDO con `mensajeError = CANAL_NO_CONFIGURADO` si faltan).
  WHATSAPP_API_VERSION: Joi.string().default('v20.0'),
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().optional().allow(''),
  WHATSAPP_ACCESS_TOKEN: Joi.string().optional().allow(''),
  SMTP_HOST: Joi.string().default('localhost'),
  SMTP_PORT: Joi.number().default(1025),
  SMTP_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASSWORD: Joi.string().optional().allow(''),
  SMTP_FROM_EMAIL: Joi.string().email().default('no-reply@delivery.com'),
  SMTP_FROM_NAME: Joi.string().default('Delivery System'),
  FIREBASE_PROJECT_ID: Joi.string().optional().allow(''),
  FIREBASE_PRIVATE_KEY: Joi.string().optional().allow(''),
  FIREBASE_CLIENT_EMAIL: Joi.string().optional().allow(''),
  NOTIFICACIONES_LIMITE_HORA: Joi.number().default(20),
});
