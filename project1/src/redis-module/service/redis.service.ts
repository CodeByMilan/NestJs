import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from '../repositories/redis.repository';
import { retry } from 'rxjs';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async setKey(key: string, value: any) {
    const time=5*1000
    await this.redisRepository.set(key, value,time);
  }
  async getKey(key: string) {
    return await this.redisRepository.get(key);
  }

  async getWrongPassswordAttempt(key: string) {
    return await this.redisRepository.get(key);
  }
//   async setWrongPassswordAttempt(key: string, value: string) {
//     await this.redisRepository.set(key, value);
//   }

//   async wrongPasswordAttempt(key: string) {
//     console.log('world')
//     let attempt:any = 1;
//     console.log(attempt)
//     const wrongPassswordAttempt = await this.redisRepository.get(key);
//     console.log(wrongPassswordAttempt)
//     if (wrongPassswordAttempt) {
//       let wrongPassswordAttemptCount: any = parseInt(wrongPassswordAttempt);
//       attempt = wrongPassswordAttemptCount++;
//        await this.redisRepository.set(key, attempt);
//        console.log(attempt)
//     } else {
//       await this.redisRepository.set(key, attempt);
//       console.log(attempt) 
//     }
//     return attempt;
//   }

//   async wrongPassword(key: string) {
//     const maxAttempt =5
//     console.log('hello')
//     const numberOfAttempt:any = await this.wrongPasswordAttempt(key);
//     console.log(numberOfAttempt)
//     if (numberOfAttempt >= maxAttempt) {
//         return 'blocked'
//     }
//     if (numberOfAttempt == 1) {
//       return 'tried once ';
//     } else if (numberOfAttempt > 1) {
//       return 'tried ' + numberOfAttempt + ' times';
//     } else {
//       return 'first time';
//     }
//   }
}
