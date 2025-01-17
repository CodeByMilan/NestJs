import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CommandAppModule } from './command/command.app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandAppModule, {
    logger: false,
  });

  try {
    console.log('Starting CLI command...');
    const commandService = app.select(CommandModule).get(CommandService);
    await commandService.exec();
    console.log('CLI command executed successfully.');
  } catch (error) {
    console.error('Error during CLI command execution:', error);
  } finally {
    await app.close();
    console.log('Application context closed.');
  }
}

bootstrap();