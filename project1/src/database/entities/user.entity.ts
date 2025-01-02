import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

 export enum ROLE {
  ADMIN = 'admin',
  CUSTOMER='customer'
}
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

  @Column({default:ROLE.CUSTOMER})
  role: ROLE;
  
  @Column({ nullable: true })
  profileImage: string;
 
}
