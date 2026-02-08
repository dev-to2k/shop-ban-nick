'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormSelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  triggerClassName?: string;
  className?: string;
  required?: boolean;
}

export function FormSelect({ name, label, options, triggerClassName, className, required }: FormSelectProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}{required && <span className="text-destructive ml-0.5">*</span>}</FormLabel>}
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className={cn(fieldState.error && 'border-destructive focus:ring-destructive', triggerClassName)}>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
