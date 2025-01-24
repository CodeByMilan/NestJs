import { Module } from '@nestjs/common';
import { RedisRepository } from './repositories/redis.repository';
import { RedisService } from './service/redis.service';
import { RedisController } from './controller/redis.controller';
import { REDIS_CLIENT_CONNECTION } from './constant/constant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Module({
  imports: [ConfigModule],
  controllers: [RedisController],
  providers: [
    RedisRepository,
    RedisService,
    {
      provide: REDIS_CLIENT_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisClient = createClient({
          url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
          password: configService.get<string>('REDIS_DATABASE_PASS'), 
        });

        redisClient.on('error', (err) => {
          console.error('Redis Client Error:', err);
        });

        await redisClient.connect();

        console.log('Connected to Redis');

        return redisClient;
      },
    },
  ],
  exports: [RedisService, REDIS_CLIENT_CONNECTION],
})
export class RedisModule {}
