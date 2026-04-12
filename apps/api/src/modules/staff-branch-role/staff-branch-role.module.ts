import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffBranchRole } from './staff-branch-role.entity';
import { People } from '@modules/people/people.entity';
import { Location } from '@modules/location/location.entity';
import { StaffBranchRoleController } from './staff-branch-role.controller';
import { StaffBranchRoleService } from './staff-branch-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffBranchRole, People, Location])],
  controllers: [StaffBranchRoleController],
  providers: [StaffBranchRoleService],
  exports: [StaffBranchRoleService],
})
export class StaffBranchRoleModule {}
