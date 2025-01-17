import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ROLE, User } from '../database/entities/user.entity';
import { DataSource} from 'typeorm';


@Injectable()
export class CommandAppService {
  constructor(
    private readonly connection: DataSource,
  ) {
    console.log('CommandAppService instantiated');
  }

  @Command({
    command: 'seed:admin',
    describe: 'seed admin data in the database',
  })
  async seeds(): Promise<void> {
    console.log('inside seed command');
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const check = await queryRunner.manager.findOne(User, {
        where: { email: 'admin@gmail.com' },
      });
      if (check) {
        console.log('Admin data already seeded');
        return;
      }

      const admin = queryRunner.manager.create(User, {
        userName:'admin',
        password: 'admin123',
        email: 'admin@gmail.com',
        role: ROLE.ADMIN,
      });
      await queryRunner.manager.save(User, admin);
      await queryRunner.commitTransaction();
      console.log('Admin user seeded successfully');
    } catch (error) {
      console.log('Error during admin seeding:', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
