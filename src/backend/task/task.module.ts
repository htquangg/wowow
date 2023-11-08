import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import {
  GrpcReflectionModule,
  addReflectionToGrpcConfig,
} from 'nestjs-grpc-reflection';
import { TaskService } from './service/task.service';
import { TaskGrpcController } from './delivery/grpc/task.grpc-controller';
import { getMetadataArgsStorage } from '../global';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './repository/task.entity';

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
    TypeOrmModule.forFeature([Task]),
    GrpcReflectionModule.register(taskGrpcClientOptions),
  ],
  controllers: [TaskGrpcController],
  providers: [TaskService],
})
export class TaskModule {}
