import { Dispatch, SetStateAction } from 'react';

export type SideBarProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
