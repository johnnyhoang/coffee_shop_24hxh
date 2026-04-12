import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  HomeIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { RiDrinks2Fill } from 'react-icons/ri';
import React from 'react';

export type MenuItem = {
  id: number;
  label: string;
  key: string;
  path: string;
  Icon: React.ElementType;
};

export type Menu = {
  id: string;
  label: string;
  items: MenuItem[];
};

export const menus: Menu[] = [
  {
    id: 'overview',
    label: 'Tổng quan',
    items: [
      {
        id: 0,
        label: 'Trang chủ',
        key: 'home',
        path: '/',
        Icon: HomeIcon,
      },
    ],
  },
  {
    id: 'operations',
    label: 'Vận hành',
    items: [
      {
        id: 11,
        label: 'Khách / People',
        key: 'people',
        path: '/people',
        Icon: UserGroupIcon,
      },
      {
        id: 7,
        label: 'Đồ uống',
        key: 'drinks',
        path: '/drinks',
        Icon: RiDrinks2Fill,
      },
      {
        id: 12,
        label: 'Chi nhánh',
        key: 'locations',
        path: '/locations',
        Icon: BuildingOffice2Icon,
      },
      {
        id: 13,
        label: 'Nhân viên & chi nhánh',
        key: 'staff-assignments',
        path: '/staff-assignments',
        Icon: BuildingStorefrontIcon,
      },
    ],
  },
  {
    id: 'system',
    label: 'Hệ thống',
    items: [
      {
        id: 9,
        label: 'Danh mục dùng chung',
        key: 'masters',
        path: '/masters',
        Icon: WrenchScrewdriverIcon,
      },
    ],
  },
];

/** Thanh điều hướng dưới (mobile): tối đa 5 mục rõ ràng */
export const bottomNavPaths = [
  { path: '/', label: 'Trang chủ', end: true },
  { path: '/drinks', label: 'Đồ uống', end: false },
  { path: '/people', label: 'Khách', end: false },
  { path: '/locations', label: 'Chi nhánh', end: false },
  { path: '/masters', label: 'Danh mục', end: false },
] as const;
