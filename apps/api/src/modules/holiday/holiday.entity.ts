import { CustomBaseEntity } from '@modules/common/entities/base.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('PK_Holiday', ['holidayId'], { unique: true }) // Tạo chỉ mục duy nhất cho cột holidayId
@Entity('holiday') // Tên bảng trong cơ sở dữ liệu (đã đổi thành chữ thường)
export class Holiday extends CustomBaseEntity {
  static entityName: string = 'Holiday'; // Tên của entity này

  constructor(partial: Partial<Holiday>) {
    super();
    this.entityName = Holiday.entityName;
    Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào instance này
  }

  // Khóa chính, tự động tăng
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' }) // Đổi tên cột thành 'id'
  holidayId: number;

  // Cột lưu trữ ngày lễ, kiểu dữ liệu datetime, có thể là null
  @Column({ type: 'datetime', nullable: true, name: 'holiday' }) // Đổi tên cột thành 'holiday'
  holiday: Date | null;

  // Cột lưu trữ quốc gia, kiểu dữ liệu varchar với độ dài 50 ký tự
  @Column({ type: 'varchar', length: 50, name: 'country' }) // Đổi tên cột thành 'country'
  country: string;

  // Cột lưu trữ tên ngày lễ, có thể là null, kiểu dữ liệu varchar với độ dài 255 ký tự
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'holiday_name',
  }) // Đổi tên cột thành 'holiday_name'
  holidayName: string | null;
}
