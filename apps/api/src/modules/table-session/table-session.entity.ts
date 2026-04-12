import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '@modules/common/entities/base.entity';

/**
 * Phiên phục vụ tại bàn: nhận đơn = mở phiên (có khách), trả bàn = đóng phiên.
 * Một bàn chỉ có tối đa một phiên đang mở (closed_at null).
 */
@Entity('coffee_table_session')
export class TableSession extends CustomBaseEntity {
  static entityName = 'TableSession';

  constructor(partial: Partial<TableSession>) {
    super();
    this.entityName = TableSession.entityName;
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'session_id' })
  sessionId: number;

  @Index()
  @Column({ type: 'int', name: 'table_id' })
  tableId: number;

  @Index()
  @Column({ type: 'int', name: 'location_id' })
  locationId: number;

  @Column({ type: 'int', name: 'guest_count' })
  guestCount: number;

  @Column({ type: 'timestamptz', name: 'opened_at' })
  openedAt: Date;

  @Column({ type: 'timestamptz', name: 'closed_at', nullable: true })
  closedAt: Date | null;
}
