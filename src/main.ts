import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule, grpcClientOptions } from './app.module';

async function bootstrap() {
  // initialize transactional context
  initializeTransactionalContext();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions,
  );
  await app.listen();
}
bootstrap();
