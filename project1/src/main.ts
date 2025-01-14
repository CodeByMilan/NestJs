import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/responseInterceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  //application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  //applying global interceptor to send response 
  app.useGlobalInterceptors(new TransformInterceptor());
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

  await app.listen(3000);
}
bootstrap();
