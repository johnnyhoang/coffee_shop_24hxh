import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  FormProvider,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormProps,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import { FormProps, Form as RACForm } from 'react-aria-components';

type ValidationFormProps<T> = UseFormProps<T> & {
  children: (
    isFormValid: boolean,
    formChanged: boolean,
    formSubmit: UseFormHandleSubmit<T, T>,
    getValues: UseFormGetValues<T>,
    setValue?: UseFormSetValue<T>,
  ) => ReactNode;
  onSubmit?: (data: T) => void;
};

export const Form = (props: FormProps) => {
  return (
    <RACForm
      {...props}
      className={twMerge('flex flex-col gap-4', props.className)}
    />
  );
};

export const ValidationForm = <T,>({
  children,
  onSubmit,
  ...rest
}: ValidationFormProps<T>) => {
  const form = useForm<T>({ ...rest });
  const handleFormSubmit = form.handleSubmit((data: T) => {
    onSubmit && onSubmit(data);
  });

  return (
    <Form
      className="p-2 border border-[#dedede] rounded-md"
      onSubmit={handleFormSubmit}
    >
      <FormProvider {...form}>
        {children(
          form.formState.isValid,
          form.formState.isDirty,
          form.handleSubmit,
          form.getValues,
          form.setValue,
        )}
      </FormProvider>
    </Form>
  );
};
