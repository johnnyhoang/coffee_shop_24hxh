import { GroupBase, StylesConfig } from 'react-select';

import { FONT_SIZE } from './select.constants';

import { SelectStyleProps } from './select.type';

const getSelectStyle = <
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  width,
  height,
  isError,
  menuWidth,
}: SelectStyleProps): StylesConfig<Option, IsMulti, Group> => {
  const labelProps = {
    fontSize: FONT_SIZE,
    lineHeight: '16px',
    letterSpacing: '-0.01px',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  };

  const getOpacity = (isDisabled: boolean) => {
    return isDisabled ? 0.38 : 1;
  };

  const customStyles: StylesConfig<Option, IsMulti, Group> = {
    container: (baseStyles) => ({
      ...baseStyles,
      width,
    }),
    control: (baseStyles, { isDisabled, isFocused }) => ({
      ...baseStyles,
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: height,
      cursor: 'pointer',
      background: isDisabled ? '#f0f1f2ff' : 'white',
      border: `1px solid ${isError ? '#ff897a' : isFocused ? '#1677ff' : '#d9d9d9'}`,
      borderRadius: '6px',
      outline: 'none',
      padding: '0 12px',
      boxShadow: isFocused ? '0 0 0 2px rgba(5,145,255,0.1)' : 'none',
      '&:hover': {
        borderColor: '#4096ff',
        background: isDisabled ? '#f0f1f2ff' : '#ffffffff',
      },
    }),
    singleValue: (baseStyles, { isDisabled }) => ({
      ...baseStyles,
      ...labelProps,
      margin: 0,
      color: isDisabled ? '#1417214d' : '#141721e0',
    }),
    placeholder: (baseStyles, { isDisabled }) => ({
      ...baseStyles,
      ...labelProps,
      color: isDisabled ? '#1417214d' : '#9ca3af',
    }),
    valueContainer: (baseStyles, { isDisabled }) => ({
      ...baseStyles,
      ...labelProps,
      padding: 0,
      color: isDisabled ? '#1417214d' : '#141721e0',
    }),
    input: (baseStyles) => ({
      ...baseStyles,
      display: 'none',
    }),
    menu: ({ width, ...baseStyles }) => ({
      ...baseStyles,
      ...labelProps,
      borderRadius: '8px',
      margin: '4px 0',
      width: menuWidth || width,
      minWidth: menuWidth || width,
      backgroundColor: 'white',
    }),
    option: (baseStyles, { isDisabled }) => ({
      ...baseStyles,
      ...labelProps,
      display: 'flex',
      alignItems: 'center',
      color: isDisabled ? '#1417214d' : '#141721e0',
      padding: 8,
      cursor: 'pointer',
      backgroundColor: 'transparent',
      '&:hover': {
        background: '#14172114',
      },
      whiteSpace: 'normal',
    }),
    menuPortal: (baseStyles) => ({
      ...baseStyles,
      zIndex: 9999,
    }),
    dropdownIndicator: (baseStyles, { isDisabled }) => ({
      ...baseStyles,
      padding: 0,
      color: isDisabled ? '#14172199' : '#1417214d',
      opacity: getOpacity(isDisabled),
      '&:hover': {
        opacity: getOpacity(isDisabled),
        color: isDisabled ? '#14172199' : '#1417214d',
      },
    }),
  };

  return customStyles;
};

export { getSelectStyle };
