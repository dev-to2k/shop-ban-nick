'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FormCheckboxProps {
  name: string;
  label: string;
  className?: string;
}

export function FormCheckbox({ name, label, className }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('flex flex-row items-center gap-2 space-y-0', className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={fieldState.error ? 'border-destructive data-[state=checked]:bg-destructive' : undefined}
            />
          </FormControl>
          <FormLabel className="mt-0 cursor-pointer">{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
