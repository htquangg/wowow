import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { TaskStatus } from '../task.enum';
import { Task } from '../repository/task.entity';
import { TaskAction } from '../repository/task-action.entity';
import { TaskFile } from '../repository/task-file.entity';
import { TaskFacadeService } from './task.facade-service';
import { Readable } from 'stream';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskAction)
    private readonly taskActionRepository: Repository<TaskAction>,
    private taskFacadeService: TaskFacadeService,
  ) {}

  public async create(task: Omit<DeepPartial<Task>, 'status'>): Promise<Task> {
    return await this.taskRepository.save({
      ...task,
      status: TaskStatus.INIT,
    });
  }

  public async updateStatus(id: string, status: TaskStatus): Promise<void> {
    await this.taskRepository.update(id, { status });
  }

  public async findOneById(id: string): Promise<Task> {
    return await this.taskRepository.findOneBy({ id });
  }

  public async findOneBy(
    where: FindOptionsWhere<Task> | FindOptionsWhere<Task>[],
  ): Promise<Task> {
    return await this.taskRepository.findOneBy(where);
  }

  public async uploadFile(
    rawFilename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
  ) {
    const mime = rawFilename
      .substring(rawFilename.lastIndexOf('.') + 1, rawFilename.length)
      .toLowerCase();

    const filename = this.generateFilename(rawFilename) + '.' + mime;

    const file = await this.taskFacadeService.uploadFile(filename, content);

    return file;
  }

  protected generateFilename(rawFilename?: string): string {
    return nanoid() + '-' + rawFilename || '';
  }
}
