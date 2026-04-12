import { BaseEntity } from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * Lớp trừu tượng CustomBaseEntity kế thừa từ BaseEntity
 * Cung cấp thuộc tính và phương thức cơ bản cho các entity khác
 */
export abstract class CustomBaseEntity extends BaseEntity {
  @Exclude()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _entityName: string = ''; // Tên của entity, thuộc tính riêng và không được xuất hiện trong kết quả JSON

  /**
   * Lấy tên của entity
   * @returns Tên của entity
   */
  public get entityName(): string {
    return this._entityName;
  }

  /**
   * Đặt tên cho entity
   * @param value Tên mới của entity
   */
  public set entityName(value: string) {
    this._entityName = value;
  }
}
