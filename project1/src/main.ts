import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/responseInterceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { EventGateWay } from './socket/event.gateway';

async function bootstrap() {
  //application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  //applying global interceptor to send response 
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('E-commerce')
    .setDescription('API documentation for e-commerce')
    .setVersion('1.0')
    .addTag('E-commerce')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', 
      },
      'access-token', 
    )
    .build()
  //generate swagger document
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('ecommerce/api', app, documentFactory);

//template engine
app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  //this is used to listen to some events as soon as the client connects
// const eventGateWay=app.get(EventGateWay);
// setInterval(()=>eventGateWay.sendMessage(),2000)

  await app.listen(3000,'192.168.1.101')
  
  console.log('server is listening on  ',await app.getUrl())
}
bootstrap();
