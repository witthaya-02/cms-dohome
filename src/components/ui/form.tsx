'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

interface FormMessageProps extends React.ComponentProps<'p'> {
  showSpace?: boolean;
}

function FormMessage({ className, showSpace, ...props }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return showSpace ? <div className="h-[15px]" /> : null;
  }

  return (
    <div
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-[12px] h-[15px] pl-[15px]', className)}
      {...props}
    >
      {body}
    </div>
  );
}

import { Path, UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
type FormInputProps<T extends FieldValues> = {
  name: Path<T>; // keyof แบบ type-safe
  label: string;
  type?: string;
  form: UseFormReturn<T>; // ส่ง form มาเป็น props
  disable: boolean;
  showSpaceErrorMessage?: boolean;
  maxLength?: number; // เพิ่ม optional maxLength prop
  placeholder?: string;
};

const FormInput = <T extends FieldValues>({
  name,
  label,
  type,
  form,
  disable,
  showSpaceErrorMessage,
  maxLength,
  placeholder,
}: FormInputProps<T>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="text-[12px]">
          {label}
          <span className="text-red-500">*</span>
        </div>
        <FormControl>
          <Input
            {...field}
            type={type}
            value={field.value}
            name={field.name}
            maxLength={maxLength || (field.name === 'taxId' ? 15 : undefined)}
            placeholder={`กรอก${placeholder ? placeholder : label}`}
            disabled={disable}
          />
        </FormControl>
        <FormMessage showSpace={showSpaceErrorMessage} />
      </FormItem>
    )}
  />
);

export {
  FormInput,
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
