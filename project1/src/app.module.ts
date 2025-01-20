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
import { NodeMailerService } from './utils/mail/nodeMailer.service';
import { WishListModule } from './modules/wishlist/wishlist.module';

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
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 1000,
      store: redisStore,
    }),
    UserModule,
    ProductModule,
    OrderModule,
    CartModule,
    DatabaseModule,
    WishListModule
  ],
  providers:[NodeMailerService]
})
export class AppModule {}
