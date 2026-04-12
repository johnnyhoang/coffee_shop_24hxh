import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Cấu hình Swagger cho ứng dụng NestJS.
 *
 * @param app - Đối tượng ứng dụng NestJS.
 */
export function configSwagger(app: INestApplication) {
  // Tạo cấu hình Swagger cho tài liệu API
  const config = new DocumentBuilder()
    .setTitle('Coffee App Project') // Tiêu đề của tài liệu API
    .setDescription('## Coffee App API description') // Mô tả API
    .setVersion('1.0.0') // Phiên bản API
    .build();

  // Tạo tài liệu Swagger từ cấu hình
  const document = SwaggerModule.createDocument(app, config);

  // Cấu hình và cài đặt Swagger UI
  SwaggerModule.setup('api/v1/api-docs', app, document, {
    swaggerOptions: {}, // Các tùy chọn Swagger bổ sung
    customJs: '/swagger-custom.js', // Tập tin JavaScript tùy chỉnh cho Swagger UI
    customSiteTitle: 'Coffee App Documentation', // Tiêu đề của trang Swagger UI
    customfavIcon: '/swagger.ico', // Biểu tượng yêu thích tùy chỉnh cho trang Swagger UI
  });
}
