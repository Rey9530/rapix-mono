import { Global, Module } from '@nestjs/common';
import { RedisServicio } from './redis.servicio.js';

@Global()
@Module({
  providers: [RedisServicio],
  exports: [RedisServicio],
})
export class RedisModulo {}
