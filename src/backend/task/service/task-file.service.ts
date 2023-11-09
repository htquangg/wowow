import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskFile } from '../repository/task-file.entity';

@Injectable()
export class TaskFileService {
  constructor(
    @InjectRepository(TaskFile)
    private readonly taskFileRepository: Repository<TaskFile>,
  ) {}

  async uploadFile(
    taskId: string,
    filename: string,
    options?: {
      path?: string;
      baseUrl?: string;
      completedUrl?: string;
      mime?: string;
      metadata?: any;
    },
  ): Promise<TaskFile> {
    const file = new TaskFile();
    file.taskId = taskId;
    file.name = filename;
    file.path = options?.path;
    file.baseUrl = options?.baseUrl;
    file.completedUrl = options?.completedUrl;
    file.mime = options?.mime;
    file.metadata = options?.metadata;
    return await this.taskFileRepository.save(file);
  }
}
