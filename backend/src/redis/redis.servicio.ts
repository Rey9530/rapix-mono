import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisServicio implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisServicio.name);
  private cliente!: Redis;

  onModuleInit(): void {
    this.cliente = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
    this.cliente.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.cliente?.quit();
  }

  get instancia(): Redis {
    return this.cliente;
  }

  async ping(): Promise<boolean> {
    try {
      const pong = await this.cliente.ping();
      return pong === 'PONG';
    } catch {
      return false;
    }
  }
}
