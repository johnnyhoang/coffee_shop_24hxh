import { CustomBaseEntity } from '@modules/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cf24_location') // Tên bảng trong cơ sở dữ liệu
export class Location extends CustomBaseEntity {
  static entityName: string = 'Location'; // Tên của entity này

  constructor(partial: Partial<Location>) {
    super();
    this.entityName = Location.entityName;
    Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào instance này
  }

  // Khóa chính, tự động tăng
  @PrimaryGeneratedColumn({ type: 'int', name: 'location_id' }) // Đổi tên cột thành 'location_id'
  locationId: number;

  // Cột lưu trữ vùng, kiểu dữ liệu varchar với độ dài 50 ký tự
  @Column({ type: 'varchar', length: 50, name: 'region' }) // Đổi tên cột thành 'region'
  region: string;

  // Cột lưu trữ quốc gia, có thể là null
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'country' }) // Đổi tên cột thành 'country'
  country: string | null;

  // Cột lưu trữ địa điểm, có thể là null
  @Column({ type: 'varchar', nullable: true, name: 'location' }) // Đổi tên cột thành 'location'
  location: string | null;

  // Cột lưu trữ mã địa điểm, có thể là null
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'location_code',
  }) // Đổi tên cột thành 'location_code'
  locationCode: string | null;
}
