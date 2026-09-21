import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '@modules/common/entities/base.entity';

@Index('pk_drinks', ['drinkId'], { unique: true }) // Tạo chỉ mục duy nhất cho cột drinkId
@Entity('cf24_drinks')
export class Drinks extends CustomBaseEntity {
  static entityName: string = 'Drinks'; // Tên của entity này

  constructor(partial: Partial<Drinks>) {
    super();
    this.entityName = Drinks.entityName;
    Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào instance này
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'drinks_id' }) // Định nghĩa cột khóa chính tự động tăng của bảng
  drinkId: number;

  @Column('varchar', { name: 'drinks_name', nullable: true, length: 45 }) // Định nghĩa cột drinkName, kiểu dữ liệu varchar với độ dài 50 ký tự
  drinkName: string | null;

  @Column('int', { name: 'price', nullable: true }) // Định nghĩa cột drinkName, kiểu dữ liệu varchar với độ dài 50 ký tự
  price: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
