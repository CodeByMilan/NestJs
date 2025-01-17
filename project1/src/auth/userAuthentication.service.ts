import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { logInDto } from 'src/user/dto/login-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserAuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //login
  async login(loginDto: logInDto): Promise<string> {
    try {
      console.log("data",loginDto)
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({ where: { email },
      select : ['password','email','id','role','userName'] });
      console.log('user',user)
      if (!user) {
        throw new UnauthorizedException('Invalid username or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid  username or password ');
      }
      const payload = { id: user.id, userName:user.userName, email: user.email, role: user.role };
      console.log('payload',payload)
      const token =this.jwtService.sign(payload, {
        expiresIn: '365d',
        secret: process.env.JWT_SECRET,
      });
      // console.log(token)
      return token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
