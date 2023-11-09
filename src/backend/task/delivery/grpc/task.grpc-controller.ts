import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TaskService } from '../../service/task.service';

@Controller()
export class TaskGrpcController {
  constructor(private taskService: TaskService) {}

  @GrpcMethod('TaskService', 'Create')
  public async create(
    data: any,
  ): Promise<{ id: string; name: string; status: string }> {
    const task = await this.taskService.create({ name: data['name'] });
    return {
      id: task.id,
      name: task.name,
      status: task.status,
    };
  }

  @GrpcMethod('TaskService', 'UpdateStatus')
  public async updateStatus(data: any): Promise<void> {
    await this.taskService.updateStatus(data['id'], data['status']);
  }

  @GrpcMethod('TaskService', 'GetOneById')
  public async getOneById(
    data: any,
  ): Promise<{ id: string; name: string; status: string }> {
    const task = await this.taskService.findOneById(data['id']);
    // TODO: will check not found
    return {
      id: task?.id,
      name: task?.name,
      status: task?.status,
    };
  }
}
