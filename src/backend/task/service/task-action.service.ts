import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskAction } from '../repository/task-action.entity';
import { ActionStatus, ActionType } from '../task.enum';

@Injectable()
export class TaskActionService {
  constructor(
    @InjectRepository(TaskAction)
    private readonly taskActionRepository: Repository<TaskAction>,
  ) {}

  async predict(taskId: string, coordinates: any): Promise<TaskAction> {
    const taskAction = new TaskAction();
    taskAction.taskId = taskId;
    taskAction.type = ActionType.PREDICT;
    taskAction.status = ActionStatus.INIT;
    taskAction.metadata = coordinates;
    return await this.taskActionRepository.save(taskAction);
  }

  public async findOneById(id: string): Promise<TaskAction> {
    return await this.taskActionRepository.findOneBy({ id });
  }
}
