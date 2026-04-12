import { Props as ReactSelectProps, GroupBase } from 'react-select';

export type SelectStyleProps = {
  height?: number;
  width?: number;
  isError?: boolean;
  menuWidth?: number;
  isDisabled?: boolean;
};

export type SelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = ReactSelectProps<Option, IsMulti, Group> & SelectStyleProps;

export type TSelectOption = {
  value: string | number;
  label: string;
};
