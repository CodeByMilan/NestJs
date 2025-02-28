import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClientType } from 'redis'; 
import { REDIS_CLIENT_CONNECTION } from '../constant/constant';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) 
  private readonly redisClient: RedisClientType) {}

  
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      return value; // Returns `null` if the key does not exist
    } catch (error) {
      console.error(`Error fetching key "${key}":`, error.message);
      throw new Error('Failed to fetch the key from Redis');
    }
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
