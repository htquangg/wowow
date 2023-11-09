import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TaskService } from '../../service/task.service';
import { TaskActionService } from '../../service/task-action.service';

@Controller()
export class TaskGrpcController {
  constructor(
    private taskService: TaskService,
    private taskActionService: TaskActionService,
  ) {}

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
    await this.taskService.updateStatus(data['taskId'], data['status']);
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

  @GrpcMethod('TaskService', 'Predict')
  public async predict(data: any): Promise<any> {
    const task = await this.taskService.findOneById(data['taskId']);
    // TODO: will check not found
    const taskAction = await this.taskActionService.predict(
      task.id,
      data['coordinates'],
    );
    return {
      actionId: taskAction.id,
    };
  }

  @GrpcMethod('TaskService', 'GetActionById')
  public async getActionById(data: any): Promise<any> {
    const taskAction = await this.taskActionService.findOneById(data['id']);
    // TODO: will check not found
    return {
      id: taskAction.id,
      type: taskAction.type,
      status: taskAction.status,
      taskId: taskAction.taskId,
      coordinates: taskAction.metadata,
    };
  }
}
