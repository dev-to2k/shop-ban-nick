'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './form';
import { Input } from '../input';
import { cn } from '@shared/utils';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  valueAsNumber?: boolean;
  required?: boolean;
  'data-testid'?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({ name, label, placeholder, type, className, valueAsNumber, required, 'data-testid': dataTestId, onChange }: FormInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}{required && <span className="text-destructive ml-0.5">*</span>}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className={cn(fieldState.error && 'border-destructive focus-visible:ring-destructive')}
              data-testid={dataTestId}
              {...field}
              onChange={(e) => {
                valueAsNumber ? field.onChange(e.target.valueAsNumber ?? 0) : field.onChange(e);
                onChange?.(e);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
