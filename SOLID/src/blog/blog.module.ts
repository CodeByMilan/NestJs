import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { Blog } from './entities/blog.entity';
import { EmailModule } from 'src/email/email.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [EmailModule,
    PaymentModule,
    TypeOrmModule.forFeature([Blog])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
