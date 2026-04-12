import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const moduleAlias = require('module-alias');
  moduleAlias.addAliases({
    '@configs': join(__dirname, 'configs'),
    '@modules': join(__dirname, 'modules'),
  });

  console.log('[bootstrap] starting', {
    cwd: process.cwd(),
    dirname: __dirname,
    vercel: process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
  });

  const { AppModule } = require('./app.module');
  const { configSwagger } = require('@configs/api-docs.config');
  const { AllExceptionsFilter } = require('./common/filters/all-exceptions.filter');

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

  // CORS: thêm domain production qua biến CORS_ORIGINS (cách nhau dấu phẩy). Preview Vercel *.vercel.app được phép HTTPS.
  const extraOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowedOrigins = [
    'http://localhost:5001',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://minkoi.io.vn',
    'http://123.30.136.246',
    ...extraOrigins,
  ];
  // Cấu hình CORS (Cross-Origin Resource Sharing)
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const vercelPreview =
        !!origin &&
        /^https:\/\/[^/]+\.vercel\.app$/i.test(origin);
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || vercelPreview) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
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

bootstrap().catch((error) => {
  console.error('[bootstrap] failed', error);
  process.exit(1);
});
