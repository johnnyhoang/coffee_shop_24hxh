import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LocationModule } from '@modules/location/location.module';
import { HolidayModule } from '@modules/holiday/holiday.module';
import { MasterDataModule } from '@modules/masters/master-data.module';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { PeopleModule } from '@modules/people/people.module';

import { CoffeeTableModule } from '@modules/coffeetable/coffeetable.module';

import { DrinksModule } from '@modules/drinks/drinks.module';


@Module({
  imports: [
    // Sử dụng ClsModule để quản lý bối cảnh (context) toàn cầu
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),

    // Cấu hình module quản lý biến môi trường và xác thực biến với Joi
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'), // Xác định môi trường (development hoặc production)
        PORT: Joi.number().required(), // Cổng mà ứng dụng sẽ chạy
        DATABASE_TYPE: Joi.string().valid('postgres').required(),
        DATABASE_HOST: Joi.string().required(), // Địa chỉ máy chủ cơ sở dữ liệu
        DATABASE_PORT: Joi.number().required(), // Cổng của cơ sở dữ liệu
        DATABASE_USERNAME: Joi.string().required(), // Tên người dùng của cơ sở dữ liệu
        DATABASE_PASSWORD: Joi.string().required(), // Mật khẩu của cơ sở dữ liệu
        DATABASE_NAME: Joi.string().required(),
        DATABASE_SYNCHRONIZE: Joi.string().valid('true', 'false').default('false'),
      }),
      isGlobal: true, // Đặt module cấu hình này là toàn cục
      cache: true, // Bật tính năng cache để tăng hiệu suất
      expandVariables: true, // Cho phép mở rộng biến môi trường
      envFilePath: '.env', // Đường dẫn đến file .env
    }),

    // Cấu hình kết nối TypeORM với cơ sở dữ liệu
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          synchronize: configService.get<string>('DATABASE_SYNCHRONIZE') === 'true',
          logging: Boolean(configService.get<string>('DATABASE_LOGGING')),
          entities: [`${__dirname}/modules/**/*.entity{.ts,.js}`],
          migrations: [`${__dirname}/db/migrations/*{.ts,.js}`],
        };
      },
      inject: [ConfigService], // Sử dụng ConfigService để lấy giá trị cấu hình
    }),

    // Các module khác của ứng dụng
    LocationModule,
    DrinksModule,
    HolidayModule,
    MasterDataModule,
    PeopleModule,
    CoffeeTableModule,
  ],
  controllers: [AppController], // Các bộ điều khiển của ứng dụng
  providers: [AppService], // Các dịch vụ cung cấp trong phạm vi toàn ứng dụng
})
export class AppModule {
  constructor(private dataSource: DataSource) {} // Khởi tạo DataSource để sử dụng cho các kết nối CSDL
}
