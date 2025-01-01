import { Injectable } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private users = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'ADMIN',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'INTERN',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'ENGINEER',
    },
    {
      id: 4,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      role: 'ADMIN',
    },
    {
      id: 5,
      name: 'Eve Adams',
      email: 'eve.adams@example.com',
      role: 'ENGINEER',
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      role: 'INTERN',
    },
    {
      id: 7,
      name: 'Grace Hopper',
      email: 'grace.hopper@example.com',
      role: 'ENGINEER',
    },
    {
      id: 8,
      name: 'Hank Pym',
      email: 'hank.pym@example.com',
      role: 'ADMIN',
    },
    {
      id: 9,
      name: 'Ivy Carter',
      email: 'ivy.carter@example.com',
      role: 'INTERN',
    },
    {
      id: 10,
      name: 'Jack Daniels',
      email: 'jack.daniels@example.com',
      role: 'ENGINEER',
    },
  ];

  findAll(role?:'INTERN' |'ENGINEER'|'ADMIN'){
    if(role){
        return this.users.filter(user =>user.role===role)
    }
    return this.users
    }
     
    findOne(id:number){
    const user= this.users.find(user => user.id === id)
    return user
    }

    create(user:createUserDto){
        //logic to create new user with the highest id as we are not using any database
        const usersByHighestId=[...this.users].sort((a,b)=>b.id-a.id)
        const newUser={
            id:usersByHighestId[0].id+1,
            ...user
        }
        this.users.push(newUser)
        return newUser
    }

    update (id:number,updatedUser:updateUserDto){
        this.users=this.users.map(user=>{
            if(user.id===id){
                return {...user,...updatedUser}
                }
                return user
        })
        return this.findOne(id)
    }
    delete(id:number){
        const removeUser =this.findOne(id)
        this.users=this.users.filter(user=>user.id!==id)
        return removeUser
    }
}
