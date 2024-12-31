import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PracticeModule } from './practice/practice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DatabaseModule } from './practice/model/connection';

@Module({
  imports: [PracticeModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'nest',
          autoLoadEntities:true,
          synchronize: true,
        }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
