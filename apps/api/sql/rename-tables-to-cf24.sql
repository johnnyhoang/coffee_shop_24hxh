-- Script SQL đổi tên toàn bộ các bảng hiện có trên Supabase sang prefix cf24_ (Giữ nguyên toàn bộ dữ liệu)
ALTER TABLE IF EXISTS "location" RENAME TO "cf24_location";
ALTER TABLE IF EXISTS "people" RENAME TO "cf24_people";
ALTER TABLE IF EXISTS "holiday" RENAME TO "cf24_holiday";
ALTER TABLE IF EXISTS "drinks" RENAME TO "cf24_drinks";
ALTER TABLE IF EXISTS "master_data" RENAME TO "cf24_master_data";
ALTER TABLE IF EXISTS "coffeeTable" RENAME TO "cf24_coffee_table";
ALTER TABLE IF EXISTS "coffeetable" RENAME TO "cf24_coffee_table";
ALTER TABLE IF EXISTS "staff_branch_role" RENAME TO "cf24_staff_branch_role";
ALTER TABLE IF EXISTS "coffee_table_session" RENAME TO "cf24_coffee_table_session";
