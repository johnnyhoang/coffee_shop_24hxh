import { ForwardedRef, forwardRef } from 'react';
import {
  ValidationResult,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';

import { inputStyles, composeTailwindRenderProps } from 'utils';

import {
  Label,
  FieldError,
  Description,
  TextArea as RACTextArea,
} from 'components/field';

export interface TextAreaFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  rows?: number;
  cols?: number;
}

export const TextAreaField = forwardRef(
  (
    { label, description, errorMessage, ...props }: TextAreaFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <AriaTextField
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        `flex flex-col gap-1 col-span-${props.cols ? props.cols : 2}`,
      )}
    >
      {label && <Label>{label}</Label>}
      <RACTextArea rows={props.rows} className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  ),
);
