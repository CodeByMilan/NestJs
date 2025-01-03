import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [UserModule, 
      ConfigModule.forRoot({
        isGlobal: true,  
        envFilePath: '.env',  
      }),DatabaseModule,
      MulterModule.register({
        dest: './uploads',
      }),
      ProductModule,
      OrderModule],
})
export class AppModule {}
