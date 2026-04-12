import {
  ArrowPathRoundedSquareIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { RiDrinks2Fill } from "react-icons/ri";
import { CakeIcon, GlobeAsiaAustraliaIcon } from '@heroicons/react/24/outline'; // Ensure you import your icons correctly
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
    id: 'group1',
    label: 'GROUP 1',
    items: [
      {
        id: 1,
        label: 'Feature 1',
        key: 'feature1',
        path: '/feature1',
        Icon: ArrowPathRoundedSquareIcon,
      },
    ],
  },
  {
    id: 'group2',
    label: 'GROUP 2',
    items: [
      {
        id: 11,
        label: 'People',
        key: 'common_data',
        path: '/people',
        Icon: GlobeAsiaAustraliaIcon,
      },
      {
        id: 7,
        label: 'Drinks',
        key: 'common_data',
        path: '/drinks',
        Icon: RiDrinks2Fill,
      },
      {
        id: 12,
        label: 'Location',
        key: 'common_data',
        path: '/locations',
        Icon: GlobeAsiaAustraliaIcon,
      },
      {
        id: 13,
        label: 'Holiday',
        key: 'common_data',
        path: '/holidays',
        Icon: CakeIcon,
      },
      {
        id: 9,
        label: 'Master Data',
        key: 'admin',
        path: '/masters',
        Icon: WrenchScrewdriverIcon,
      },
    ],
  },
];
