import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ScrapperModule } from './scrapper.module';

// create logger instance
const logger = new Logger('Scrapper Main');

// create microservice options
const microserviceOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.SW_SCRAPPER_MICRO_HOST,
    port: +process.env.SW_SCRAPPER_MICRO_PORT,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    ScrapperModule,
    microserviceOptions,
  );
  await app.listen(() => logger.log('Scrapper microservice is listening...'));
}
bootstrap();
