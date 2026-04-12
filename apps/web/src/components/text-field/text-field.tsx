import {
  ValidationResult,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';

import { inputStyles, composeTailwindRenderProps } from 'utils';

import { Description, FieldError, Input, Label } from 'components/field';
import { ForwardedRef, forwardRef } from 'react';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string | React.ReactNode;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const TextField = forwardRef(
  (
    { label, description, errorMessage, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <AriaTextField
        {...props}
        ref={ref}
        className={composeTailwindRenderProps(
          props.className,
          'flex flex-col gap-1',
        )}
      >
        {label && <Label>{label}</Label>}
        <Input className={inputStyles.base.concat(' flex-none')} />
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    );
  },
);
