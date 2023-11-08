import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../repository/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  @InjectRepository(Task) protected readonly repository: Repository<Task>;
}
