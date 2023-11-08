import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../repository/task.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TaskStatus } from '../task.enum';

@Injectable()
export class TaskService {
  @InjectRepository(Task) protected readonly repository: Repository<Task>;

  public async create(task: Omit<DeepPartial<Task>, 'status'>): Promise<Task> {
    return await this.repository.save({
      ...task,
      status: TaskStatus.INIT,
    });
  }

  public async updateStatus(id: string, status: TaskStatus): Promise<void> {
    await this.repository.update(id, { status });
  }

  public async getOneById(id: string): Promise<Task> {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
