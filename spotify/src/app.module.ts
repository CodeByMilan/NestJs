import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';

@Module({
  imports: [SongsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    //appy middleware for the all routes 
   // consumer.apply(LoggerMiddleware).forRoutes('songs')
    //apply middle ware for the specific route and method
  //  consumer.apply(LoggerMiddleware).forRoutes({
  //   path: 'songs',
  //   method: RequestMethod.POST
  //  })
//apply middleware for the controller
   consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }

}
