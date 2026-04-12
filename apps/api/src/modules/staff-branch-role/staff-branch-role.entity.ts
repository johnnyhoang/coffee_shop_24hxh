import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CustomBaseEntity } from '@modules/common/entities/base.entity';
import { People } from '@modules/people/people.entity';
import { Location } from '@modules/location/location.entity';

/**
 * Phân công nhân viên theo chi nhánh: cùng một người có thể có vai trò khác nhau ở mỗi chi nhánh.
 * Ràng buộc duy nhất (people_id + location_id): mỗi chi nhánh chỉ một vai trò cho một nhân viên.
 */
@Entity('staff_branch_role')
@Unique('uk_staff_branch_role_people_location', ['peopleId', 'locationId'])
export class StaffBranchRole extends CustomBaseEntity {
  static entityName: string = 'StaffBranchRole';

  constructor(partial: Partial<StaffBranchRole>) {
    super();
    this.entityName = StaffBranchRole.entityName;
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', name: 'staff_branch_role_id' })
  staffBranchRoleId: number;

  @Column({ type: 'int', name: 'people_id' })
  peopleId: number;

  @ManyToOne(() => People, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'people_id' })
  people: People;

  @Column({ type: 'int', name: 'location_id' })
  locationId: number;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id', referencedColumnName: 'locationId' })
  branch: Location;

  /** Mã vai trò — thuộc danh sách STAFF_ROLES */
  @Column({ type: 'varchar', length: 50, name: 'role' })
  role: string;
}
