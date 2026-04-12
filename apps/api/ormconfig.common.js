import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

// Tải các biến môi trường từ tệp .env
dotenv.config();

// Kiểm tra các biến môi trường cần thiết cho kết nối cơ sở dữ liệu
if (
  !(
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USERNAME &&
    process.env.DATABASE_PASSWORD &&
    process.env.DATABASE_NAME
  )
) {
  Logger.error(
    'Các giá trị môi trường cơ sở dữ liệu chưa được cấu hình. Vui lòng chuẩn bị tệp .env hoặc xuất các biến môi trường cơ sở dữ liệu.',
  );
  process.exit(1);
}

// Tạo đối tượng DataSource để cấu hình kết nối với cơ sở dữ liệu
const connectionSource = new DataSource({
  type: 'mysql', // Thay đổi loại cơ sở dữ liệu từ MSSQL sang MySQL
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/entities/**/*.{js,ts}'], // Đường dẫn đến các thực thể
  migrations: [__dirname + '/dist/src/migrations/*.js'], // Đường dẫn đến các migration
});

export { connectionSource };
