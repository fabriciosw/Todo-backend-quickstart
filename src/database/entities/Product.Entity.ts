import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export default class Product {
  @PrimaryGeneratedColumn('uuid')
  public id?: number;

  @Column({ length: 100 })
  public title: string;

  @Column({ nullable: true })
  public image: string;

  @Column({ length: 400, nullable: true })
  public description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column()
  public created_at: Date;
}
