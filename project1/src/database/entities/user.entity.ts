import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({default:'customer'})
  role: string;
  
  @Column({ nullable: true })
  profileImage: string;
 
}
