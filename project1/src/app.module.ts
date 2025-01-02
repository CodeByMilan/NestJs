import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [UserModule, 
      ConfigModule.forRoot({
        isGlobal: true,  
        envFilePath: '.env',  
      }),DatabaseModule,
      MulterModule.register({
        dest: './uploads',
      })],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
