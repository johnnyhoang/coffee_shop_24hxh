/* eslint-disable @typescript-eslint/no-var-requires */
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Yêu cầu thư viện hashids
const Hashids = require('hashids/cjs');

// Khởi tạo ConfigService để lấy cấu hình
const configService: ConfigService = new ConfigService();

/**
 * Mã hóa ID thành hash ID
 *
 * @param key - khóa tiền tố dùng để mã hóa
 * @param id - ID cần được mã hóa
 * @returns - trả về hash ID đã mã hóa
 */
export const hashIdEncode = (key: string, id: number): string => {
  const hashids = getHashIds(key); // Lấy đối tượng Hashids tương ứng với khóa

  return hashids.encode(id); // Mã hóa ID và trả về hash ID
};

/**
 * Giải mã hash ID thành ID gốc
 *
 * @param key - khóa tiền tố dùng để giải mã
 * @param hashId - hash ID cần được giải mã
 * @returns - trả về ID gốc hoặc -1 nếu giải mã không thành công
 */
export const hashIdDecode = (
  key: string,
  hashId: string,
): number | bigint | undefined => {
  const hashids = getHashIds(key); // Lấy đối tượng Hashids tương ứng với khóa
  const ret = hashids.decode(hashId); // Giải mã hash ID

  return ret.length > 0 ? ret[0] : -1; // Trả về ID gốc nếu giải mã thành công, hoặc -1 nếu không thành công
};

// Lưu trữ các đối tượng Hashids đã tạo để tái sử dụng
const hashIdsMap: { [key: string]: any } = {};

/**
 * Lấy đối tượng Hashids cho khóa đã cho
 *
 * @param key - khóa tiền tố dùng để lấy đối tượng Hashids
 * @returns - trả về đối tượng Hashids tương ứng với khóa
 */
const getHashIds = (key: string): any => {
  if (key in hashIdsMap) {
    return hashIdsMap[key.toString()]; // Trả về đối tượng Hashids đã lưu nếu có
  }

  // Tạo đối tượng Hashids mới với khóa tiền tố và độ dài bằng độ dài của DATABASE_PASSWORD
  const instance = new Hashids(
    key + '-' + configService.get('DATABASE_PASSWORD'),
    configService.get('DATABASE_PASSWORD').length,
  );

  hashIdsMap[key.toString()] = instance; // Lưu đối tượng Hashids để tái sử dụng

  return instance; // Trả về đối tượng Hashids mới tạo
};

/**
 * Chuyển đổi ID giữa dạng số và dạng hash ID
 *
 * @param id - ID cần chuyển đổi (có thể là số hoặc chuỗi hash ID)
 * @param entityName - tên thực thể để lấy khóa tiền tố
 * @returns - trả về ID dưới dạng số
 * @throws BadRequestException - nếu ID không hợp lệ
 */
export const hashIdConvert = (
  id: number | string,
  entityName: string,
): number => {
  if (typeof id === 'number') {
    return id; // Nếu ID là số, trả về số đó
  } else if (typeof id === 'string') {
    return hashIdDecode(entityName, id) as number; // Nếu ID là chuỗi, giải mã nó thành số
  }

  throw new BadRequestException('Id is invalid'); // Ném lỗi nếu ID không hợp lệ
};
