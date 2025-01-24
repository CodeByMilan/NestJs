import { Controller, Get } from '@nestjs/common';
import { RedisService } from '../service/redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async getRedis() {
    const key ='count'
    const data=await this.redisService.getKey(key)
    console.log(data)
    if(!data){
        await this.redisService.setKey(key,1);
    }
    const newCount=(parseInt(data))+1
    await this.redisService.setKey(key,newCount)
   return newCount

  }
}
