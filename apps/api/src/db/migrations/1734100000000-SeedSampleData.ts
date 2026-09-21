import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Dữ liệu mẫu cho chuỗi cà phê kiểu Highlands/Phúc Long (tên quán dùng thương hiệu app 24HXH).
 * ~22 món (đồ uống + đồ ăn nhẹ), 3 chi nhánh, 10 bàn, 60 người (50 khách + 10 NV), phân công NV, master_data, ngày lễ.
 *
 * Chạy: npm run migration:run (từ root hoặc apps/api)
 */
export class SeedSampleData1734100000000 implements MigrationInterface {
  name = 'SeedSampleData1734100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [{ cnt }] = (await queryRunner.query(
      `SELECT COUNT(*)::int AS cnt FROM "cf24_location"`,
    )) as [{ cnt: number }];
    if (cnt > 0) {
      return;
    }

    await queryRunner.query(`
      INSERT INTO "cf24_location" ("location_id", "region", "country", "location", "location_code")
      VALUES
        (1, 'South', 'Vietnam', '24HXH Lê Lợi — Quận 1', 'HCM-Q1-LL'),
        (2, 'North', 'Vietnam', '24HXH Đinh Tiên Hoàng — Hoàn Kiếm', 'HN-HK-DTH'),
        (3, 'Central', 'Vietnam', '24HXH Bạch Đằng — Hải Châu', 'DN-HC-BD');
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_people" ("people_id", "gender", "age", "fullname", "idnumber")
      VALUES
        (1, 'Female', 34, 'Nguyễn Thị Minh An', '079082001234'),
        (2, 'Male', 31, 'Trần Hoàng Nam', '079082001235'),
        (3, 'Female', 24, 'Lê Thu Hà', '079082001236'),
        (4, 'Male', 22, 'Phạm Quốc Huy', '079082001237'),
        (5, 'Female', 29, 'Hoàng Mai Linh', '079082001238'),
        (6, 'Male', 26, 'Đỗ Văn Thắng', '079082001239'),
        (7, 'Female', 23, 'Võ Thị Kim Ngân', '079082001240'),
        (8, 'Male', 35, 'Bùi Đức Thịnh', '079082001241'),
        (9, 'Female', 21, 'Đặng Ngọc Trâm', '079082001242'),
        (10, 'Male', 28, 'Vũ Hải Đăng', '079082001243');
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_people" ("people_id", "gender", "age", "fullname", "idnumber")
      SELECT
        10 + g,
        CASE WHEN g % 2 = 1 THEN 'Female' ELSE 'Male' END,
        18 + (g % 45),
        'Khách mẫu ' || g::text,
        LPAD(g::text, 10, '0')
      FROM generate_series(1, 50) AS g;
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_master_data" ("data_id", "category", "value", "code", "code_text", "description", "parent_data_id")
      VALUES
        (1, 'NHÓM_MENU', 'CÀ_PHÊ', 1, 'Cà phê', 'Phin, espresso, pha máy', NULL),
        (2, 'NHÓM_MENU', 'TRÀ', 2, 'Trà', 'Trà đen, ô long, trà sữa', NULL),
        (3, 'NHÓM_MENU', 'FREEZE', 3, 'Đá xay', 'Freeze, sinh tố', NULL),
        (4, 'NHÓM_MENU', 'BÁNH', 4, 'Bánh ngọt', 'Mousse, tiramisu, croissant', NULL),
        (5, 'NHÓM_MENU', 'ĐỒ_ĂN', 5, 'Đồ ăn nhẹ', 'Mì, cơm, salad', NULL),
        (6, 'CỠ', 'S', 10, 'Nhỏ', '~12oz', NULL),
        (7, 'CỠ', 'M', 11, 'Vừa', '~16oz', NULL),
        (8, 'CỠ', 'L', 12, 'Lớn', '~20oz', NULL),
        (9, 'THANH_TOÁN', 'TIỀN_MẶT', 20, 'TM', NULL, NULL),
        (10, 'THANH_TOÁN', 'THE', 21, 'Thẻ', NULL, NULL),
        (11, 'THANH_TOÁN', 'QR', 22, 'QR / ví', NULL, NULL),
        (12, 'VÙNG', 'HCM', 30, 'TP.HCM', NULL, NULL),
        (13, 'VÙNG', 'HN', 31, 'Hà Nội', NULL, NULL),
        (14, 'VÙNG', 'ĐN', 32, 'Đà Nẵng', NULL, NULL);
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_drinks" ("drinks_id", "drinks_name", "price", "description")
      VALUES
        (1, 'Phin đen đá', 39000, 'Cà phê phin truyền thống'),
        (2, 'Phin sữa đá', 45000, 'Phin + sữa đặc'),
        (3, 'Latte nóng', 55000, 'Espresso + sữa'),
        (4, 'Cappuccino', 52000, 'Espresso + bọt sữa'),
        (5, 'Americano đá', 45000, 'Espresso + nước'),
        (6, 'Trà đào cam sả', 49000, 'Trà đen, đào, cam, sả'),
        (7, 'Trà sen vàng', 54000, 'Ô long, hương sen'),
        (8, 'Trà ô long đào', 48000, 'Ô long, đào'),
        (9, 'Trà sữa ô long', 52000, 'Ô long + sữa'),
        (10, 'Freeze trà xanh', 59000, 'Đá xay matcha'),
        (11, 'Sinh tố xoài', 55000, 'Xoài tươi'),
        (12, 'Nước ép cam', 48000, 'Cam vắt'),
        (13, 'Bánh mousse cacao', 42000, 'Bánh ngọt'),
        (14, 'Tiramisu ly', 45000, 'Bánh tiramisu'),
        (15, 'Croissant bơ', 35000, 'Bánh Pháp'),
        (16, 'Phô mai New York', 48000, 'Bánh phô mai'),
        (17, 'Mì Ý sốt kem', 79000, 'Đồ ăn nóng'),
        (18, 'Cơm niêu gà', 85000, 'Cơm gà nướng'),
        (19, 'Salad cá hồi', 92000, 'Salad tươi'),
        (20, 'Phô mai que', 35000, 'Ăn kèm'),
        (21, 'Xúc xích nướng', 45000, 'Ăn kèm'),
        (22, 'Khoai tây chiên', 38000, 'Ăn kèm');
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_holiday" ("id", "holiday", "country", "holiday_name")
      VALUES
        (1, '2026-01-01 00:00:00', 'VN', 'Tết Dương lịch'),
        (2, '2026-04-30 00:00:00', 'VN', 'Giải phóng miền Nam'),
        (3, '2026-05-01 00:00:00', 'VN', 'Quốc tế Lao động'),
        (4, '2026-09-02 00:00:00', 'VN', 'Quốc khánh'),
        (5, '2026-12-25 00:00:00', 'VN', 'Giáng sinh (kinh doanh)');
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_coffee_table" ("table_id", "table_number", "table_status", "table_size", "location_id")
      VALUES
        (1, 1, false, '2-4 người', 1),
        (2, 2, false, '2-4 người', 1),
        (3, 3, true, '4-6 người', 1),
        (4, 4, false, '6-8 người', 1),
        (5, 5, false, '2-4 người', 2),
        (6, 6, false, '4-6 người', 2),
        (7, 7, true, '2-4 người', 2),
        (8, 8, false, '2-4 người', 3),
        (9, 9, false, '4-6 người', 3),
        (10, 10, false, '6-8 người', 3);
    `);

    await queryRunner.query(`
      INSERT INTO "cf24_staff_branch_role" ("staff_branch_role_id", "people_id", "location_id", "role")
      VALUES
        (1, 1, 1, 'owner'),
        (2, 2, 1, 'manager'),
        (3, 3, 1, 'barista'),
        (4, 4, 1, 'cashier'),
        (5, 5, 2, 'manager'),
        (6, 6, 2, 'barista'),
        (7, 7, 2, 'staff'),
        (8, 8, 3, 'manager'),
        (9, 9, 3, 'barista'),
        (10, 10, 3, 'kitchen');
    `);

    await queryRunner.query(`
      SELECT setval(pg_get_serial_sequence('cf24_location', 'location_id'), (SELECT COALESCE(MAX("location_id"), 1) FROM "cf24_location"));
      SELECT setval(pg_get_serial_sequence('cf24_people', 'people_id'), (SELECT COALESCE(MAX("people_id"), 1) FROM "cf24_people"));
      SELECT setval(pg_get_serial_sequence('cf24_master_data', 'data_id'), (SELECT COALESCE(MAX("data_id"), 1) FROM "cf24_master_data"));
      SELECT setval(pg_get_serial_sequence('cf24_drinks', 'drinks_id'), (SELECT COALESCE(MAX("drinks_id"), 1) FROM "cf24_drinks"));
      SELECT setval(pg_get_serial_sequence('cf24_holiday', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "cf24_holiday"));
      SELECT setval(pg_get_serial_sequence('cf24_coffee_table', 'table_id'), (SELECT COALESCE(MAX("table_id"), 1) FROM "cf24_coffee_table"));
      SELECT setval(pg_get_serial_sequence('cf24_staff_branch_role', 'staff_branch_role_id'), (SELECT COALESCE(MAX("staff_branch_role_id"), 1) FROM "cf24_staff_branch_role"));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "cf24_staff_branch_role"`);
    await queryRunner.query(`DELETE FROM "cf24_coffee_table_session"`);
    await queryRunner.query(`DELETE FROM "cf24_coffee_table"`);
    await queryRunner.query(`DELETE FROM "cf24_holiday"`);
    await queryRunner.query(`DELETE FROM "cf24_drinks"`);
    await queryRunner.query(`DELETE FROM "cf24_master_data"`);
    await queryRunner.query(`DELETE FROM "cf24_people"`);
    await queryRunner.query(`DELETE FROM "cf24_location"`);
  }
}
