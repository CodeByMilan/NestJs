import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeederService{
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    
  ) {
    this.seedAdmin()
  }

  async seedAdmin(): Promise<void> {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const admin = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!admin) {
      // Hash password and create admin user
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);
      await this.userRepository.save({
        email: adminEmail,
        password: hashedPassword,
        userName: 'admin',
        role: 'ADMIN',
      });

      this.logger.log('Admin credentials seeded successfully');
    } else {
      this.logger.log('Admin credentials already seeded');
    }
  }
}