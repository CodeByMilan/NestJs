import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { config } from 'dotenv';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load:[config],
    }),
    DatabaseModule,
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    CacheModule.register({
      isGlobal:true,
      ttl: 100*10000,
      store:redisStore
    }),
    ProductModule,
    OrderModule,
    CartModule,
  ],
})
export class AppModule {}
