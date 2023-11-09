import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskAction } from '../repository/task-action.entity';

@Injectable()
export class TaskActionService {
  constructor(
    @InjectRepository(TaskAction)
    private readonly taskActionRepository: Repository<TaskAction>,
  ) {}
}
