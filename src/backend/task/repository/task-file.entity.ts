import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from './task.entity';

@Entity({ name: 'task_files' })
export class TaskFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'task_id', nullable: false, length: 36 })
  taskId: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'path', nullable: true })
  path?: string;

  @Column({ name: 'base_url', nullable: true })
  baseUrl?: string;

  @Column({ name: 'completed_url', nullable: true })
  completedUrl?: string;

  @Column({ name: 'mime', nullable: true })
  mime?: string;

  @Column({ name: 'metadata', nullable: true, type: 'json' })
  metadata?: any;
}
