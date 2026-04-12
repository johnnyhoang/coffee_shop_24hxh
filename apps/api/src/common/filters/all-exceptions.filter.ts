import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/**
 * Lọc tất cả các ngoại lệ trong ứng dụng NestJS.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Xử lý các ngoại lệ được ném ra.
   *
   * @param exception - Ngoại lệ cần xử lý.
   * @param host - Đối tượng ArgumentsHost cung cấp các phương thức để truy cập đối tượng HTTP request và response.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Chuyển đổi host thành đối tượng HTTP context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse(); // Lấy đối tượng response
    const request = ctx.getRequest(); // Lấy đối tượng request

    // Xác định mã trạng thái HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // Nếu ngoại lệ là HttpException, lấy mã trạng thái từ ngoại lệ
        : HttpStatus.INTERNAL_SERVER_ERROR; // Nếu không phải, sử dụng mã trạng thái lỗi máy chủ nội bộ

    // Xác định thông điệp lỗi
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    // Safely access exception stack trace
    const stack = (exception as any).stack || '';
    // Ghi log thông tin lỗi
    this.logger.error(`Status: ${status}, Error: ${JSON.stringify(message)}`);
    // Log error details
    // Log error details
    this.logger.error(
      `HTTP ${status} ${request.method} ${request.url} ${message}`,
      stack,
    );

    // Trả về phản hồi lỗi cho client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(), // Thời gian xảy ra lỗi
      path: request.url, // Đường dẫn URL yêu cầu
      message, // Thông điệp lỗi
    });
  }
}
