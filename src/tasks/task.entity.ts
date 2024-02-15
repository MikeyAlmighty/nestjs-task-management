import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TASK_STATUS } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TASK_STATUS;

  @ManyToOne(_type => User, user => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User
}