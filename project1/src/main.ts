import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  //application instance
  const app = await NestFactory.create(AppModule, { cors: true });
  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('E-commerce')
    .setDescription('API documentation for e-commerce')
    .setVersion('1.0')
    .addTag('E-commerce')
    .build()
  //generate swagger document
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('ecommerce/api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
