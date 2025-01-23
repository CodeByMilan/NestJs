import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';

import { config } from 'dotenv';
import { NodeMailerService } from './utils/mail/nodeMailer.service';
import { WishListModule } from './modules/wishlist/wishlist.module';
import { EventGateWayModule } from './socket/event.module';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore as unknown as string,
        ttl: 60 * 1000, // 1 minute
        ...RedisConfig(configService), // Use the factory function correctly
      }),
    }),
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    DatabaseModule,
    WishListModule,
    EventGateWayModule,
    JwtModule

  ],
  providers:[NodeMailerService]
})
export class AppModule {}
