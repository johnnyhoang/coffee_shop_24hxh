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
import { StaffBranchRoleModule } from '@modules/staff-branch-role/staff-branch-role.module';

import { DrinksModule } from '@modules/drinks/drinks.module';

import { typeOrmOptionsFromDatabaseUrl } from './configs/postgres-from-url';

@Module({
  imports: [
    // Sử dụng ClsModule để quản lý bối cảnh (context) toàn cầu
    ClsModule.forRoot({ global: true, middleware: { mount: true } }),

    // Cấu hình module quản lý biến môi trường và xác thực biến với Joi
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        // Hoặc DATABASE_URL (Supabase pooler / PgBouncer), hoặc tách HOST/PORT/...
        DATABASE_URL: Joi.string().allow('').optional(),
        DIRECT_URL: Joi.string().allow('').optional(),
        DATABASE_HOST: Joi.string().when('DATABASE_URL', {
          is: Joi.string().min(1),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        DATABASE_PORT: Joi.when('DATABASE_URL', {
          is: Joi.string().min(1),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        DATABASE_USERNAME: Joi.when('DATABASE_URL', {
          is: Joi.string().min(1),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        DATABASE_PASSWORD: Joi.when('DATABASE_URL', {
          is: Joi.string().min(1),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        DATABASE_NAME: Joi.when('DATABASE_URL', {
          is: Joi.string().min(1),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        DB_SYNCHRONIZE: Joi.string().valid('true', 'false').optional(),
        DATABASE_SYNCHRONIZE: Joi.string().valid('true', 'false').default('false'),
        DB_SSL: Joi.string().valid('true', 'false').optional(),
        DATABASE_SSL: Joi.string().valid('true', 'false').optional(),
        DATABASE_LOGGING: Joi.string().optional(),
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
        const databaseUrl = configService.get<string>('DATABASE_URL')?.trim();
        const synchronize =
          configService.get<string>('DB_SYNCHRONIZE') === 'true' ||
          configService.get<string>('DATABASE_SYNCHRONIZE') === 'true';
        const logging =
          configService.get<string>('DATABASE_LOGGING') === 'true';
        const sslEnabled =
          configService.get<string>('DB_SSL') === 'true' ||
          configService.get<string>('DATABASE_SSL') === 'true';
        const ssl = sslEnabled ? { rejectUnauthorized: false } : false;

        const base = {
          type: 'postgres' as const,
          synchronize,
          logging,
          ssl,
          entities: [`${__dirname}/modules/**/*.entity{.ts,.js}`],
          migrations: [`${__dirname}/db/migrations/*{.ts,.js}`],
        };

        if (databaseUrl) {
          return {
            ...base,
            ...typeOrmOptionsFromDatabaseUrl(databaseUrl, ssl),
          };
        }

        return {
          ...base,
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: String(
            configService.get<string>('DATABASE_PASSWORD') ?? '',
          ),
          database: configService.get<string>('DATABASE_NAME'),
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
    StaffBranchRoleModule,
  ],
  controllers: [AppController], // Các bộ điều khiển của ứng dụng
  providers: [AppService], // Các dịch vụ cung cấp trong phạm vi toàn ứng dụng
})
export class AppModule {
  constructor(private dataSource: DataSource) {} // Khởi tạo DataSource để sử dụng cho các kết nối CSDL
}
