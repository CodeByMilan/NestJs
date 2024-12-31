import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm"
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

    @JoinTable()
    @OneToMany(tye=>Hobbies,
        hobby=>hobby.practices,
    )
    hobbies:string[]
}
