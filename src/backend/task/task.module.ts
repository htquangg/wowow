import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  GrpcReflectionModule,
  addReflectionToGrpcConfig,
} from 'nestjs-grpc-reflection';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AwsModule } from '../services/aws/aws.module';

import { getMetadataArgsStorage } from '../global';
import { TaskGrpcController } from './delivery/grpc/task.grpc-controller';
import { TaskHttpController } from './delivery/http/task.http-controller';

import { TaskService } from './service/task.service';
import { TaskActionService } from './service/task-action.service';
import { TaskFileService } from './service/task-file.service';
import { TaskFacadeService } from './service/task.facade-service';

import { Task } from './repository/task.entity';
import { TaskAction } from './repository/task-action.entity';
import { TaskFile } from './repository/task-file.entity';

getMetadataArgsStorage().packages.push('task');
getMetadataArgsStorage().protoPaths.push(
  join(__dirname, './delivery/grpc/proto/task.proto'),
);

export const taskGrpcClientOptions: GrpcOptions = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    package: [...getMetadataArgsStorage().packages],
    protoPath: [...getMetadataArgsStorage().protoPaths],
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAction, TaskFile]),
    GrpcReflectionModule.register(taskGrpcClientOptions),
    AwsModule,
  ],
  controllers: [TaskGrpcController, TaskHttpController],
  providers: [
    TaskService,
    TaskActionService,
    TaskFileService,
    TaskFacadeService,
  ],
  exports: [TaskService],
})
export class TaskModule {}
