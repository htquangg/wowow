import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  GrpcReflectionModule,
  addReflectionToGrpcConfig,
} from 'nestjs-grpc-reflection';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getMetadataArgsStorage } from '../global';
import { TaskService } from './service/task.service';
import { TaskGrpcController } from './delivery/grpc/task.grpc-controller';
import { Task } from './repository/task.entity';
import { Actions } from './repository/action.entity';

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
    TypeOrmModule.forFeature([Task, Actions]),
    GrpcReflectionModule.register(taskGrpcClientOptions),
  ],
  controllers: [TaskGrpcController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
