import { Controller, Get } from '@nestjs/common'; // Import các decorator Controller và Get từ NestJS
import { AppService } from './app.service'; // Import AppService để sử dụng các phương thức của nó

@Controller() // Đánh dấu lớp này là một Controller, quản lý các yêu cầu đến từ client
export class AppController {
  // Khai báo class AppController

  constructor(private readonly appService: AppService) {}
  // Constructor nhận vào một instance của AppService
  // Dùng từ khóa "private readonly" để chỉ rõ rằng appService chỉ được sử dụng trong class này
  // và không thể bị thay đổi sau khi được khởi tạo

  @Get() // Định nghĩa một route HTTP GET cho phương thức bên dưới
  getHello(): string {
    // Phương thức getHello sẽ được gọi khi có yêu cầu HTTP GET đến endpoint "/"
    return this.appService.getHello();
    // Gọi phương thức getHello của AppService để lấy kết quả trả về (chuỗi String)
  }
}
