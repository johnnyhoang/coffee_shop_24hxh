import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration đổi tên tất cả các bảng hiện có trên Database sang prefix cf24_
 * Giữ nguyên toàn bộ dữ liệu, khóa ngoại và chỉ mục hiện tại.
 */
export class RenameTablesToCf24Prefix1734200000000 implements MigrationInterface {
  name = 'RenameTablesToCf24Prefix1734200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE IF EXISTS "location" RENAME TO "cf24_location";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "people" RENAME TO "cf24_people";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "holiday" RENAME TO "cf24_holiday";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "drinks" RENAME TO "cf24_drinks";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "master_data" RENAME TO "cf24_master_data";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "coffeeTable" RENAME TO "cf24_coffee_table";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "coffeetable" RENAME TO "cf24_coffee_table";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "staff_branch_role" RENAME TO "cf24_staff_branch_role";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "coffee_table_session" RENAME TO "cf24_coffee_table_session";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_location" RENAME TO "location";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_people" RENAME TO "people";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_holiday" RENAME TO "holiday";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_drinks" RENAME TO "drinks";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_master_data" RENAME TO "master_data";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_coffee_table" RENAME TO "coffeeTable";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_staff_branch_role" RENAME TO "staff_branch_role";`);
    await queryRunner.query(`ALTER TABLE IF EXISTS "cf24_coffee_table_session" RENAME TO "coffee_table_session";`);
  }
}
