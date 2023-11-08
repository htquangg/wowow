import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  addReflectionToGrpcConfig,
  GrpcReflectionModule,
} from 'nestjs-grpc-reflection';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { TaskModule } from './backend/task/task.module';
import { getMetadataArgsStorage } from './backend/global';

export const grpcClientOptions: GrpcOptions = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    package: [...getMetadataArgsStorage().packages],
    protoPath: [...getMetadataArgsStorage().protoPaths],
    url: 'localhost:50051',
  },
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '1',
          database: 'db-local-wow-001',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          timezone: 'Z',
          migrationsRun: true,
          migrationsTableName: 'migrations',
          migrations: [join(__dirname, 'backend', 'database', 'migrations')],
        };
      },

      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    GrpcReflectionModule.register(grpcClientOptions),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
