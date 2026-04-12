import {
  Text,
  Group,
  TextProps,
  GroupProps,
  InputProps,
  LabelProps,
  TextAreaProps,
  FieldErrorProps,
  Input as RACInput,
  Label as RACLabel,
  composeRenderProps,
  TextArea as RACTextArea,
  FieldError as RACFieldError,
  Key,
  DateValue,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import {
  useFormContext,
  Controller,
  ControllerRenderProps,
  FieldValues,
} from 'react-hook-form';

import {
  focusRing,
  fieldBorderStyles,
  composeTailwindRenderProps,
} from 'utils';

import { ComboBox, ComboBoxItem, ComboBoxProps } from 'components/combobox';
import { TextField, TextFieldProps } from 'components/text-field';
import { TextAreaField, TextAreaFieldProps } from 'components/text-area-field';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupProps,
  CheckboxProps,
} from 'components/checkbox';

import { DatePicker, DatePickerProps } from 'components/date-picker';
import { useEffect, useState } from 'react';
import { CalendarDate } from '@internationalized/date';
import { NumberField, NumberFieldProps } from 'components/number-field';
import { APP_EARLIEST_DATE, APP_LATEST_DATE } from 'config';
import { AutoComplete, AutoCompleteProps } from 'components/autocomplete';

export type ICheckbox = {
  id: string;
  name: string;
};

export const Label = (props: LabelProps) => {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        'text-sm text-gray-500 font-medium cursor-default w-fit',
        props.className,
      )}
    />
  );
};

export const Description = (props: TextProps) => {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge('text-sm text-gray-600', props.className)}
    />
  );
};

export const FieldError = (props: FieldErrorProps) => {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'text-sm text-red-600 forced-colors:text-[Mark]',
      )}
    />
  );
};

export const fieldGroupStyles = tv({
  extend: focusRing,
  base: 'group flex items-center h-8 bg-white forced-colors:bg-[Field] border-2 rounded-md overflow-hidden',
  variants: fieldBorderStyles.variants,
});

export const FieldGroup = (props: GroupProps) => {
  return (
    <Group
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        fieldGroupStyles({ ...renderProps, className }),
      )}
    />
  );
};

export const Input = (props: InputProps) => {
  return (
    <RACInput
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-white text-sm text-gray-800  disabled:!text-gray-500 text-clip',
      )}
    />
  );
};

export const TextArea = (props: TextAreaProps) => {
  return (
    <RACTextArea
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'px-2 py-1.5 flex-1 min-w-0 outline outline-0 bg-white  text-sm text-gray-800 disabled:text-gray-500',
      )}
    />
  );
};

export type BasicFieldProps = {
  as?:
  | 'textarea'
  | 'select'
  | 'textfield'
  | 'checkbox'
  | 'datepicker'
  | 'datetimepicker'
  | 'select-input'
  | 'checkboxGroup'
  | 'number'
  | 'autocomplete';
  name: string;
  label: string | React.ReactNode;
  group?: ICheckbox[];
};

type FieldProps<T> =
  | TextFieldProps
  | TextAreaFieldProps
  | ComboBoxProps
  | DatePickerProps<CalendarDate>
  | NumberFieldProps
  | CheckboxProps
  | CheckboxGroupProps
  | AutoCompleteProps<T>;

export const Field = <T,>({
  as,
  name,
  ...rest
}: BasicFieldProps &
  FieldProps<T> & { keyItem?: string; valItem?: string }) => {
  const { control, setValue, getValues, clearErrors } = useFormContext();

  const fieldProps = {
    validationBehavior: 'aria' as const,
  };
  const controllerProps = {
    name,
    control,
  };

  const [fieldState, setFieldState] = useState({
    selectedKey: getValues(controllerProps.name) || null,
  });

  useEffect(() => {
    if (fieldState.selectedKey === null) return;
    setValue(controllerProps.name, fieldState.selectedKey);
  }, [fieldState, controllerProps.name, setValue]);

  if (as === 'textarea') {
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextAreaField
            {...field}
            {...fieldProps}
            isInvalid={invalid}
            errorMessage={error?.message}
            onChange={(value) => {
              field.onChange(value);
            }}
            {...(rest as TextAreaFieldProps)}
          />
        )}
      />
    );
  }

  if (as === 'select') {
    const { children, onSelectionChange, ...remainingProps } =
      rest as ComboBoxProps;
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            selectedKey={field.value}
            onSelectionChange={(value) => {
              field.onChange(value);
              onSelectionChange?.(value);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            allowFreeform
            {...remainingProps}
          >
            {children}
          </ComboBox>
        )}
      />
    );
  }

  if (as === 'select-input') {
    const { children, items, keyItem, valItem, ...remainingProps } =
      rest as ComboBoxProps & { keyItem: string; valItem: string };

    const onSelectionChange = (
      id: Key,
      field: ControllerRenderProps<FieldValues, string>,
    ) => {
      if (!id) return;
      field.onChange(id);
      setFieldState({
        selectedKey: id,
      });
      clearErrors(name);
    };

    const onInputChange = (
      value: string,
      field: ControllerRenderProps<FieldValues, string>,
    ) => {
      field.onChange(value);
      setFieldState({
        selectedKey: value,
      });
      clearErrors(name);
    };

    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            selectedKey={fieldState.selectedKey}
            inputValue={fieldState.selectedKey || ''}
            onSelectionChange={(id) => onSelectionChange(id, field)}
            onInputChange={(value) => onInputChange(value, field)}
            formValue="key"
            isDisabled={field.disabled}
            isInvalid={invalid}
            allowsCustomValue
            errorMessage={error?.message}
            {...remainingProps}
          >
            {Array.from(items).map((item) => (
              <ComboBoxItem
                key={item[keyItem]}
                id={item[valItem] || item[keyItem]}
              >
                {item[valItem] || item[keyItem]}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
    );
  }

  if (as === 'checkbox') {
    const { label, defaultSelected, onChange } = rest as CheckboxProps;
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid } }) => (
          <Checkbox
            {...field}
            {...fieldProps}
            isInvalid={invalid}
            defaultSelected={defaultSelected}
            onBlur={field.onBlur}
            onChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
          >
            {label}
          </Checkbox>
        )}
      />
    );
  }

  if (as === 'checkboxGroup') {
    const { label, isDisabled, children } = rest as CheckboxGroupProps;
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => (
          <CheckboxGroup
            {...field}
            {...fieldProps}
            isInvalid={invalid}
            errorMessage={error?.message}
            label={label}
            isDisabled={isDisabled}
            value={field.value}
          >
            {children}
          </CheckboxGroup>
        )}
      />
    );
  }

  if (as === 'datepicker') {
    const { label, minValue, maxValue, isDisabled } =
      rest as DatePickerProps<DateValue>;
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => {
          return (
            <DatePicker
              {...field}
              {...fieldProps}
              label={label}
              isInvalid={invalid}
              hourCycle={24}
              hideTimeZone
              isDisabled={isDisabled || false}
              errorMessage={error?.message}
              minValue={minValue || APP_EARLIEST_DATE}
              maxValue={maxValue || APP_LATEST_DATE}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          );
        }}
      />
    );
  }

  if (as === 'datetimepicker') {
    const { label, minValue, maxValue, isDisabled } =
      rest as DatePickerProps<DateValue>;
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => {
          return (
            <DatePicker
              {...field}
              {...fieldProps}
              label={label}
              isInvalid={invalid}
              hourCycle={24}
              hideTimeZone
              granularity="second"
              isDisabled={isDisabled || false}
              errorMessage={error?.message}
              minValue={minValue}
              maxValue={maxValue}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          );
        }}
      />
    );
  }

  if (as === 'number') {
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { invalid, error } }) => (
          <NumberField
            {...field}
            {...fieldProps}
            isInvalid={invalid}
            errorMessage={error?.message}
            {...(rest as NumberFieldProps)}
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        )}
      />
    );
  }

  if (as === 'autocomplete') {
    return (
      <Controller
        {...controllerProps}
        render={({ field, fieldState: { error } }) => (
          <AutoComplete
            {...field}
            {...(rest as AutoCompleteProps<T>)}
            ref={field.ref}
            errorMessage={error?.message}
            onChange={(_, value) => {
              field.onChange(value);
            }}
          />
        )}
      />
    );
  }

  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState: { invalid, error } }) => (
        <TextField
          {...field}
          {...fieldProps}
          isInvalid={invalid}
          errorMessage={error?.message}
          {...(rest as TextFieldProps)}
          onChange={(value) => {
            field.onChange(value);
          }}
        />
      )}
    />
  );
};
