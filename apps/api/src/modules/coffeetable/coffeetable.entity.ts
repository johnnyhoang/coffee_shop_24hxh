import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '@modules/common/entities/base.entity';

@Entity('cf24_coffee_table') // Định nghĩa tên bảng trong cơ sở dữ liệu là 'cf24_coffee_table'
export class CoffeeTable extends CustomBaseEntity {
    static entityName: string = 'CoffeeTable'; // Tên của entity này

    constructor(partial: Partial<CoffeeTable>) {
        super();
        this.entityName = CoffeeTable.entityName;
        Object.assign(this, partial); // Gán các thuộc tính từ đối tượng partial vào instance này
    }

    @PrimaryGeneratedColumn({ type: 'int', name: 'table_id' }) // Định nghĩa cột khóa chính tự động tăng của bảng
    tableId: number;

    @Column('int', { name: 'table_number' }) // Định nghĩa cột , kiểu dữ liệu varchar với độ dài 50 ký tự
    tableNumber: number;

    @Column('boolean', { name: 'table_status' }) // Định nghĩa cột age, kiểu dữ liệu int
    tableStatus: boolean;

    @Column('varchar', { name: 'table_size', nullable: true })
    tableSize: string | null;

    /** Chi nhánh quản lý bàn (null = chưa gán, nên cập nhật qua API hoặc gán khi nhận đơn lần đầu) */
    @Column('int', { name: 'location_id', nullable: true })
    locationId: number | null;

}
