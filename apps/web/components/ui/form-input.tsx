'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  valueAsNumber?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({ name, label, placeholder, type, className, valueAsNumber, required, onChange }: FormInputProps) {
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
