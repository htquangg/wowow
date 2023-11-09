import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  // initialize transactional context
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  const configService = app.get(ConfigService);

  // http global
  app.setGlobalPrefix(configService.get<string>('app.http.globalPrefix'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('app.http.versioning.version'),
    prefix: configService.get<string>('app.http.versioning.prefix'),
  });

  await app.listen(
    configService.get<number>('app.http.port'),
    configService.get<string>('app.http.host'),
  );

  console.log(
    `HTTP server is listening on ${configService.get<number>(
      'app.http.host',
    )}:${configService.get<number>('app.http.port')}`,
  );
}
bootstrap();
