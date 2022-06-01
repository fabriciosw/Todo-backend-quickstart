import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks', { orderBy: { id: 'ASC' } })
export default class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('boolean')
  complete: boolean;

  @Column()
  user_id: number;
}
