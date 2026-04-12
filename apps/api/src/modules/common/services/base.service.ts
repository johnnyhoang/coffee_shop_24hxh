/**
 * Lớp cơ sở để quản lý các quan hệ trong dịch vụ.
 * Cung cấp các phương thức để thiết lập và lấy các quan hệ.
 */
export abstract class BaseService {
  // Danh sách các quan hệ cơ sở, khởi tạo với một mảng rỗng
  public baseRelations: string[] = [];

  // Danh sách các quan hệ hiện tại, khởi tạo với một mảng rỗng
  public relations: string[] = [];

  /**
   * Khởi tạo lớp với các quan hệ cơ sở.
   *
   * @param relations - Mảng các quan hệ cơ sở cần thiết lập
   */
  constructor(relations: string[] = []) {
    this.baseRelations = relations; // Cập nhật các quan hệ cơ sở
    this.setRelations(relations, true); // Thiết lập các quan hệ hiện tại bằng các quan hệ cơ sở
  }

  /**
   * Thiết lập các quan hệ hiện tại.
   *
   * @param relations - Mảng các quan hệ cần thiết lập
   * @param replace - Boolean cho biết có thay thế hoàn toàn các quan hệ hiện tại không
   *   - Nếu `true`, các quan hệ hiện tại sẽ bị thay thế bằng các quan hệ mới.
   *   - Nếu `false`, các quan hệ mới sẽ được thêm vào các quan hệ hiện tại mà không thay thế chúng.
   */
  setRelations(relations: string[], replace: boolean = false) {
    if (replace) {
      // Nếu thay thế, gán các quan hệ hiện tại bằng các quan hệ mới
      this.relations = [...relations];
    } else {
      // Nếu không thay thế, gán các quan hệ hiện tại bằng các quan hệ cơ sở
      this.relations = [...this.baseRelations];

      // Thêm các quan hệ mới vào danh sách các quan hệ hiện tại nếu chưa tồn tại
      relations.forEach((rel) => {
        if (!this.relations.includes(rel)) {
          this.relations.push(rel);
        }
      });
    }
  }

  /**
   * Lấy danh sách các quan hệ hiện tại.
   *
   * @returns - Mảng các quan hệ hiện tại
   */
  getRelations(): string[] {
    return this.relations;
  }
}
