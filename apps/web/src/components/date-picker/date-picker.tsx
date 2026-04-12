import { CalendarIcon } from '@heroicons/react/24/outline';
import {
  DatePicker as AriaDatePicker,
  DatePickerProps as AriaDatePickerProps,
  DateValue,
  ValidationResult,
} from 'react-aria-components';
import { Button } from 'components/button';
import { Calendar } from 'components/calendar';
import { DateInput } from 'components/date-field';
import { Dialog } from 'components/dialog';
import { Description, FieldError, FieldGroup, Label } from 'components/field';
import { Popover } from 'components/popover';
import { ForwardedRef, forwardRef } from 'react';
import { composeTailwindRenderProps } from 'utils';
import { CalendarDate } from '@internationalized/date';

export interface DatePickerProps<T extends DateValue>
  extends AriaDatePickerProps<T> {
  label?: string;
  description?: string;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const DatePicker = forwardRef(
  <T extends DateValue>(
    {
      label,
      description,
      minValue,
      maxValue,
      errorMessage,
      ...props
    }: DatePickerProps<T>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <AriaDatePicker
        ref={ref}
        {...props}
        className={composeTailwindRenderProps(
          props.className,
          'group flex flex-col gap-1',
        )}
        minValue={minValue}
        maxValue={maxValue ? maxValue : new CalendarDate(2030, 12, 31)}
      >
        {label && <Label>{label}</Label>}
        <FieldGroup className="w-auto">
          <DateInput className="flex-1 px-2 py-1.5 text-sm" />
          <Button variant="icon" className="w-6 mr-1 rounded outline-offset-0">
            <CalendarIcon aria-hidden className="w-4 h-4" />
          </Button>
        </FieldGroup>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
        <Popover>
          <Dialog>
            <Calendar />
          </Dialog>
        </Popover>
      </AriaDatePicker>
    );
  },
);
