import ReactSelect, { GroupBase } from 'react-select';

import { SELECT_WIDTH, SELECT_HEIGHT } from './select.constants';

import { getSelectStyle } from './select.utils';

import { SelectProps } from './select.type';

import CheckboxOption from './checkbox-option';
import ValueContainer from './value-container';
import DropdownIndicator from './dropdown-indicator';

export const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isMulti,
  isError,
  menuWidth,
  components,
  placeholder = '',
  isClearable = false,
  width = SELECT_WIDTH,
  height = SELECT_HEIGHT,
  ...rest
}: SelectProps<Option, IsMulti, Group>) => {
  const handleCloseMenuOnScroll = (event: Event) => {
    return event.target === document;
  };

  const additionalProps = isMulti && {
    closeMenuOnSelect: false,
    hideSelectedOptions: false,
    controlShouldRenderValue: false,
  };
  const customStyles = getSelectStyle<Option, IsMulti, Group>({
    width,
    height,
    isError,
    menuWidth,
    isDisabled: rest.isDisabled,
  });

  const commonProps = {
    placeholder,
    isClearable,
    maxMenuHeight: 248,
    minWidth: '100%',
    isSearchable: false,
    styles: customStyles,
    menuPosition: 'fixed' as const,
    menuPlacement: 'auto' as const,
    classNamePrefix: 'select',
    menuPortalTarget: document.body,
    closeMenuOnScroll: handleCloseMenuOnScroll,
    components: {
      DropdownIndicator,
      Input: (): null => null,
      IndicatorSeparator: (): null => null,
      ...(isMulti && { Option: CheckboxOption }),
      ...(isMulti && { ValueContainer }),
      ...components,
    },
    ...additionalProps,
    ...rest,
  };
  return <ReactSelect isMulti={isMulti} {...commonProps} />;
};

export default Select;
