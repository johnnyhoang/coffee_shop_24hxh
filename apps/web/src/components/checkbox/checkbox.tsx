import { ForwardedRef, ReactNode, forwardRef } from 'react';
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps as AriaCheckboxProps,
  ValidationResult,
  composeRenderProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { Description, FieldError, Label } from 'components/field';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';
import { composeTailwindRenderProps, focusRing } from 'utils';

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'children'> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const CheckboxGroup = (props: CheckboxGroupProps) => {
  return (
    <AriaCheckboxGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'flex flex-col gap-2',
      )}
    >
      <Label>{props.label}</Label>
      {props.children}
      {props.description && <Description>{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
};

const checkboxStyles = tv({
  base: 'flex gap-1 items-center group text-sm transition',
  variants: {
    isDisabled: {
      false: 'text-gray-800',
      true: 'text-gray-500 forced-colors:text-[GrayText]',
    },
  },
});

const boxStyles = tv({
  extend: focusRing,
  base: 'w-5 h-5 flex-shrink-0 rounded flex items-center justify-center border-2 transition',
  variants: {
    isSelected: {
      false:
        'bg-white  border-[--color] [--color:theme(colors.gray.400)]  group-pressed:[--color:theme(colors.gray.500)]',
      true: 'bg-[--color] border-[--color] [--color:theme(colors.gray.700)] group-pressed:[--color:theme(colors.gray.800)] forced-colors:![--color:Highlight]',
    },
    isInvalid: {
      true: '[--color:theme(colors.red.700)] forced-colors:![--color:Mark] group-pressed:[--color:theme(colors.red.800)] ',
    },
    isDisabled: {
      true: '[--color:theme(colors.gray.200)] forced-colors:![--color:GrayText]',
    },
  },
});

const iconStyles =
  'w-4 h-4 text-white group-disabled:text-gray-400 forced-colors:text-[HighlightText]';

export interface CheckboxProps extends AriaCheckboxProps {
  label?: string | React.ReactNode;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const Checkbox = forwardRef(
  (
    { label, description, errorMessage, ...props }: CheckboxProps,
    ref: ForwardedRef<HTMLLabelElement>,
  ) => (
    <AriaCheckbox
      {...props}
      ref={ref}
      className={composeRenderProps(props.className, (className, renderProps) =>
        checkboxStyles({ ...renderProps, className }),
      )}
    >
      {({ isSelected, isIndeterminate, ...renderProps }) => (
        <>
          <div
            className={boxStyles({
              isSelected: isSelected || isIndeterminate,
              ...renderProps,
            })}
          >
            {isIndeterminate ? (
              <MinusIcon aria-hidden className={iconStyles} />
            ) : isSelected ? (
              <CheckIcon aria-hidden className={iconStyles} />
            ) : null}
          </div>
          {props.children}
        </>
      )}
    </AriaCheckbox>
  ),
);
