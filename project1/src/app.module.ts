import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    CacheModule.register({
      isGlobal:true,
      ttl: 60*1000,
    }),
    ProductModule,
    OrderModule,
    CartModule,
  ],
})
export class AppModule {}
