import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListEntity } from 'src/modules/wishlist/repository/entities/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: {
          rejectUnauthorized: true,
        },
        // autoLoadEntities:true,
        entities: [__dirname + '/entities/**/*.entity{.ts,.js}',WishListEntity],
        synchronize: false,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
          entitiesDir: 'src/database/entities',

          subscribersDir: 'subscriber',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
