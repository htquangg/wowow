import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class TaskGrpcController {
  @GrpcMethod('TaskService', 'SayHelloo')
  sayHello(data: any): { message: string } {
    return { message: 'hello,world task' };
  }
}
