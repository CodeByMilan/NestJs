import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/responseInterceptor';

async function bootstrap() {
  //application instance
  const app = await NestFactory.create(AppModule, { cors: true });
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

  await app.listen(3000);
}
bootstrap();
