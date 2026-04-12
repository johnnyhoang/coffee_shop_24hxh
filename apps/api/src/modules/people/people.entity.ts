import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '@modules/common/entities/base.entity';

@Index('pk_people', ['peopleId'], { unique: true }) // Tạo chỉ mục duy nhất cho cột peopleId
@Entity('people')
export class People extends CustomBaseEntity {
  static entityName: string = 'People'; // Tên của entity này

  constructor(partial: Partial<People>) {
    super();
    this.entityName = People.entityName;
    Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào instance này
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'people_id' }) // Định nghĩa cột khóa chính tự động tăng của bảng
  peopleId: number;

  @Column('varchar', { name: 'gender', length: 50 }) // Định nghĩa cột gender, kiểu dữ liệu varchar với độ dài 50 ký tự
  gender: string;

  @Column('int', { name: 'age' }) // Định nghĩa cột age, kiểu dữ liệu int
  age: number;

  @Column('varchar', { name: 'fullname', nullable: true }) // Định nghĩa cột fullname, kiểu dữ liệu varchar, có thể null
  peopleName: string | null;

  @Column('varchar', { name: 'idnumber', nullable: true, length: 50 }) // Định nghĩa cột idnumber, kiểu dữ liệu varchar với độ dài 50 ký tự, có thể null
  idNumber: string | null;
}
