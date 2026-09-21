import { CustomBaseEntity } from '@modules/common/entities/base.entity';
import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Tạo chỉ mục duy nhất cho cột 'data_id'
@Index('pk_master_data', ['dataId'], { unique: true })
// Định nghĩa tên bảng là 'master_data'
@Entity('cf24_master_data')
export class MasterData extends CustomBaseEntity {
  // Tên của entity này
  static entityName: string = 'MasterData';

  // Khởi tạo đối tượng MasterData với thuộc tính từ đối tượng partial
  constructor(partial: Partial<MasterData>) {
    super();
    this.entityName = MasterData.entityName;
    Object.assign(this, partial);
  }

  // Khóa chính, tự động tăng
  @PrimaryGeneratedColumn({ type: 'int', name: 'data_id' })
  dataId: number;

  // Cột lưu trữ danh mục
  @Column('varchar', { name: 'category', length: 100 })
  category: string;

  // Cột lưu trữ giá trị
  @Column('varchar', { name: 'value', length: 100 })
  value: string;

  // Cột lưu trữ mã số
  @Column('int', { name: 'code' })
  code: number;

  // Cột lưu trữ mô tả mã số
  @Column('varchar', { name: 'code_text', length: 100 })
  codeText: string;

  // Cột lưu trữ mô tả chi tiết, có thể là null
  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  // Cột lưu trữ ID của dữ liệu cha, có thể là null
  @Exclude() // Loại trừ cột này khỏi việc chuyển đổi thành JSON
  @Column({
    name: 'parent_data_id',
    type: 'int',
    nullable: true,
    default: null,
  })
  parentDataId: number | null;

  // Liên kết nhiều đến một dữ liệu cha
  @Expose() // Cho phép cột này được chuyển đổi thành JSON
  @ManyToOne(() => MasterData, (masterData) => masterData.children)
  @JoinColumn({ name: 'parent_data_id', referencedColumnName: 'dataId' }) // Cột tham chiếu phải khớp với cột khóa chính
  parentData: MasterData | null;

  // Liên kết một đến nhiều dữ liệu con
  @OneToMany(() => MasterData, (masterData) => masterData.parentData)
  children: MasterData[] | null;
}
