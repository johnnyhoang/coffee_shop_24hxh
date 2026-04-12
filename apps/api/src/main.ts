import 'module-alias/register';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configSwagger } from '@configs/api-docs.config';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  // Tạo một instance của ứng dụng NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình ứng dụng
  app.setGlobalPrefix('api/v1'); // Đặt tiền tố 'api/v1' cho tất cả các route của ứng dụng
  configSwagger(app); // Cấu hình Swagger để tự động tạo tài liệu API
  app.useStaticAssets(join(__dirname, './served')); // Cung cấp các tệp tĩnh từ thư mục './served'

  // Sử dụng ValidationPipe để xác thực dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Tự động chuyển đổi kiểu dữ liệu đầu vào theo DTO
      whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Gửi lỗi nếu có thuộc tính không nằm trong whitelist
    }),
  );

  // Cấu hình CORS (Cross-Origin Resource Sharing)
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Danh sách các origin được phép gửi yêu cầu
      const allowedOrigins = [
        'http://localhost:5001',
        'http://localhost:5000',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://minkoi.io.vn',
        'http://123.30.136.246',
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Nếu origin hợp lệ hoặc không có origin, cho phép yêu cầu
      } else {
        callback(new Error('Not allowed by CORS')); // Nếu origin không hợp lệ, từ chối yêu cầu
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  };

  app.enableCors(corsOptions); // Kích hoạt CORS với các tùy chọn đã cấu hình

  // Sử dụng bộ lọc xử lý ngoại lệ toàn cầu
  app.useGlobalFilters(new AllExceptionsFilter());

  // Khởi chạy ứng dụng trên cổng được chỉ định
  const port = process.env.PORT || 3000; // Lấy cổng từ biến môi trường PORT hoặc sử dụng cổng mặc định là 3000
  await app.listen(port); // Lắng nghe các yêu cầu đến cổng đã chỉ định
}

bootstrap();
