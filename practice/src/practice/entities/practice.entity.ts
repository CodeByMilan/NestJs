import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Hobbies } from "./hobbies.entity"

@Entity()
export class Practice {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    email:string

    @Column()
    age:number

    @OneToMany( 
    type=> Hobbies, 
    (hobby) =>hobby.id )
    hobbies:Hobbies[]
}
