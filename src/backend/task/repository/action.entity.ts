import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ActionStatus, ActionType } from '../task.enum';
import { Task } from './task.entity';

@Entity({ name: 'actions' })
export class Actions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'action', nullable: false })
  type: ActionType;

  @Column({ name: 'status', nullable: false })
  status: ActionStatus;

  @Column({ name: 'task_id', nullable: false, length: 36 })
  taskId: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'metadata', nullable: true, type: 'mediumblob' })
  metadata: Buffer;
}
