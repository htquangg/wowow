import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './task.entity';
import { ActionStatus, ActionType } from '../task.enum';

@Entity({ name: 'task_actions' })
export class TaskAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'action', nullable: false })
  type: ActionType;

  @Column({ name: 'status', nullable: false })
  status: ActionStatus;

  @Column({ name: 'task_id', nullable: false, length: 36 })
  taskId: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'metadata', nullable: true, type: 'json' })
  metadata: any;
}
