'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form';
import { Textarea } from '../textarea';
import { cn } from '@shared/utils';

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function FormTextarea({ name, label, placeholder, className, required }: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}{required && <span className="text-destructive ml-0.5">*</span>}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn('min-h-[5rem]', fieldState.error && 'border-destructive focus-visible:ring-destructive')}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
