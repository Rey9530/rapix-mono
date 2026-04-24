export interface VariablesEntorno {
  NODE_ENV: 'development' | 'staging' | 'production' | 'test';
  PORT: number;
  API_PREFIX: string;
  FRONTEND_URL?: string;
  DATABASE_URL: string;

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
}
