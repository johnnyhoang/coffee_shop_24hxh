import {
  Button,
  ButtonProps,
  ValidationResult,
  NumberField as AriaNumberField,
  NumberFieldProps as AriaNumberFieldProps,
} from 'react-aria-components';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

import {
  Input,
  Label,
  Description,
  FieldError,
  FieldGroup,
} from 'components/field';
import { ForwardedRef, forwardRef } from 'react';
import { composeTailwindRenderProps, fieldBorderStyles } from 'utils';

export interface NumberFieldProps extends AriaNumberFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const NumberField = forwardRef(
  (
    { label, description, errorMessage, ...props }: NumberFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <AriaNumberField
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        'group flex flex-col gap-1',
      )}
    >
      <Label>{label}</Label>
      <FieldGroup>
        {(renderProps) => (
          <>
            <Input />
            <div
              className={fieldBorderStyles({
                ...renderProps,
                class: 'flex flex-col border-s-2',
              })}
            >
              <StepperButton slot="increment">
                <ChevronUpIcon aria-hidden className="w-4 h-4" />
              </StepperButton>
              <div
                className={fieldBorderStyles({
                  ...renderProps,
                  class: 'border-b-2',
                })}
              />
              <StepperButton slot="decrement">
                <ChevronDownIcon aria-hidden className="w-4 h-4" />
              </StepperButton>
            </div>
          </>
        )}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaNumberField>
  ),
);

const StepperButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      className="px-0.5 cursor-default text-gray-500 pressed:bg-gray-100 group-disabled:text-gray-200 dark:text-zinc-400 dark:pressed:bg-zinc-800 dark:group-disabled:text-zinc-600 forced-colors:group-disabled:text-[GrayText]"
    />
  );
};
