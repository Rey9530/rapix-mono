export interface VariablesEntorno {
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  API_PREFIX: string;
  FRONTEND_URL?: string;

  DATABASE_URL: string;

  REDIS_HOST: string;
  REDIS_PORT: number;

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;

  MAPBOX_TOKEN: string;

  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  SMTP_FROM_EMAIL: string;
  SMTP_FROM_NAME: string;

  MINIO_ENDPOINT: string;
  MINIO_REGION: string;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET_UPLOADS: string;
  MINIO_PUBLIC_URL: string;

  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
}
