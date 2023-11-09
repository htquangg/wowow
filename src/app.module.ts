import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Transport } from '@nestjs/microservices';
import {
  addReflectionToGrpcConfig,
  GrpcReflectionModule,
} from 'nestjs-grpc-reflection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import config from './backend/global/configs';
import { TaskModule } from './backend/task/task.module';
import { getMetadataArgsStorage } from './backend/global';

export const grpcClientOptions = (configService?: ConfigService) => {
  const grpcHost =
    configService?.get<number>('GRPC_HOST') || process.env['GRPC_HOST'];
  const grpcPort =
    configService?.get<number>('GRPC_PORT') || process.env['GRPC_PORT'];
  return addReflectionToGrpcConfig({
    transport: Transport.GRPC,
    options: {
      package: [...getMetadataArgsStorage().packages],
      protoPath: [...getMetadataArgsStorage().protoPaths],
      url: `${grpcHost}:${grpcPort}`,
    },
  });
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.get<string>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<string>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          timezone: 'Z',
          migrationsRun: true,
          migrationsTableName: 'migrations',
          migrations: [join(__dirname, 'backend', 'database', 'migrations')],
        } as TypeOrmModuleOptions),

      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    // GrpcReflectionModule.register(grpcClientOptions),
    GrpcReflectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return grpcClientOptions(configService);
      },
    }),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
