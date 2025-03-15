import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  donationAmount: number;

  @Column({ nullable: true })  
  category?: string;

  @Column({ nullable: true }) 
  location?: string;

  @CreateDateColumn()
  createdAt: Date;
}
