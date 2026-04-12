import clsx from 'clsx';
import { components, GroupBase, DropdownIndicatorProps } from 'react-select';

import ChevronIcon from 'assets/images/icons/chevron-down.svg?react';

const DropdownIndicator = <
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
) => {
  const isOpen = props.selectProps.menuIsOpen;
  return (
    <components.DropdownIndicator {...props}>
      <ChevronIcon className={clsx({ 'rotate-180': isOpen })} />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
