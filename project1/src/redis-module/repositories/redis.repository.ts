import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis'; 
import { REDIS_CLIENT_CONNECTION } from '../constant/constant';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) 
  private readonly redisClient: RedisClientType) {}

  
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }


  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, { EX: ttl }); 
    } else {
      await this.redisClient.set(key, value);
    }
  }


  async delete( key: string): Promise<void> {
    await this.redisClient.del(`${key}`);
  }


  async setWithExpiry( key: string, value: string, expiry: number): Promise<void> {
    await this.redisClient.set(`${key}`, value, { EX: expiry });
  }

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit(); 
    console.log('Redis connection closed');
  }
}
