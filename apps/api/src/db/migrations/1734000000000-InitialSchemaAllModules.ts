import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Schema ban đầu cho toàn bộ entity trong apps/api (PostgreSQL).
 * Thứ tự tạo bảng theo khóa ngoại.
 *
 * Chạy: cd apps/api && npm run build && npm run migration:run
 */
export class InitialSchemaAllModules1734000000000 implements MigrationInterface {
  name = 'InitialSchemaAllModules1734000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_location" (
        "location_id" SERIAL NOT NULL,
        "region" character varying(50) NOT NULL,
        "country" character varying(50),
        "location" character varying(255),
        "location_code" character varying(50),
        CONSTRAINT "PK_cf24_location" PRIMARY KEY ("location_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_people" (
        "people_id" SERIAL NOT NULL,
        "gender" character varying(50) NOT NULL,
        "age" integer NOT NULL,
        "fullname" character varying(255),
        "idnumber" character varying(50),
        CONSTRAINT "PK_cf24_people" PRIMARY KEY ("people_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_holiday" (
        "id" SERIAL NOT NULL,
        "holiday" timestamp,
        "country" character varying(50) NOT NULL,
        "holiday_name" character varying(255),
        CONSTRAINT "PK_cf24_holiday" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_drinks" (
        "drinks_id" SERIAL NOT NULL,
        "drinks_name" character varying(45),
        "price" integer,
        "description" text,
        CONSTRAINT "PK_cf24_drinks_id" PRIMARY KEY ("drinks_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_master_data" (
        "data_id" SERIAL NOT NULL,
        "category" character varying(100) NOT NULL,
        "value" character varying(100) NOT NULL,
        "code" integer NOT NULL,
        "code_text" character varying(100) NOT NULL,
        "description" text,
        "parent_data_id" integer,
        CONSTRAINT "PK_cf24_master_data" PRIMARY KEY ("data_id"),
        CONSTRAINT "FK_cf24_master_data_parent" FOREIGN KEY ("parent_data_id")
          REFERENCES "cf24_master_data"("data_id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_coffee_table" (
        "table_id" SERIAL NOT NULL,
        "table_number" integer NOT NULL,
        "table_status" boolean NOT NULL,
        "table_size" character varying(255),
        "location_id" integer,
        CONSTRAINT "PK_cf24_coffee_table" PRIMARY KEY ("table_id"),
        CONSTRAINT "FK_cf24_coffee_table_location" FOREIGN KEY ("location_id")
          REFERENCES "cf24_location"("location_id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_staff_branch_role" (
        "staff_branch_role_id" SERIAL NOT NULL,
        "people_id" integer NOT NULL,
        "location_id" integer NOT NULL,
        "role" character varying(50) NOT NULL,
        CONSTRAINT "PK_cf24_staff_branch_role" PRIMARY KEY ("staff_branch_role_id"),
        CONSTRAINT "uk_cf24_staff_branch_role_people_location" UNIQUE ("people_id", "location_id"),
        CONSTRAINT "FK_cf24_staff_branch_role_people" FOREIGN KEY ("people_id")
          REFERENCES "cf24_people"("people_id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_cf24_staff_branch_role_location" FOREIGN KEY ("location_id")
          REFERENCES "cf24_location"("location_id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cf24_coffee_table_session" (
        "session_id" SERIAL NOT NULL,
        "table_id" integer NOT NULL,
        "location_id" integer NOT NULL,
        "guest_count" integer NOT NULL,
        "opened_at" TIMESTAMPTZ NOT NULL,
        "closed_at" TIMESTAMPTZ,
        CONSTRAINT "PK_cf24_coffee_table_session" PRIMARY KEY ("session_id"),
        CONSTRAINT "FK_session_table" FOREIGN KEY ("table_id")
          REFERENCES "cf24_coffee_table"("table_id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_session_location" FOREIGN KEY ("location_id")
          REFERENCES "cf24_location"("location_id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_cf24_coffee_table_session_table_id"
        ON "cf24_coffee_table_session" ("table_id")
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_cf24_coffee_table_session_location_id"
        ON "cf24_coffee_table_session" ("location_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_coffee_table_session"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_staff_branch_role"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_coffee_table"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_master_data"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_drinks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_holiday"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_people"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cf24_location"`);
  }
}
