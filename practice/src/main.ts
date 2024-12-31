import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //this removes all the unwanted property from the request body
      whitelist: true,
      //this is used to validate if all the properties passed are defined property or not if send not defined property it discard the request
      forbidNonWhitelisted:true
    }),
  );

  await app.listen(process.env.PORT ?? 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  });
}
bootstrap();
