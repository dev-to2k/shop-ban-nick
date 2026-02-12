import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@shared/utils';

const badgeVariants = cva(
  'inline-flex items-center border font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'rounded-md px-2.5 py-0.5 text-xs border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'rounded-md px-2.5 py-0.5 text-xs border-transparent bg-secondary text-secondary-foreground',
        destructive: 'rounded-md px-2.5 py-0.5 text-xs border-transparent bg-destructive text-white shadow',
        outline: 'rounded-md px-2.5 py-0.5 text-xs text-foreground',
        success: 'rounded-md px-2.5 py-0.5 text-xs border-transparent bg-green-500 text-white shadow',
        warning: 'rounded-md px-2.5 py-0.5 text-xs border-transparent bg-yellow-500 text-white shadow',
        discount:
          'px-2.5 py-1 text-[0.7rem] border-0 text-white shadow-md ring-1 ring-black/15 [clip-path:polygon(0_0,100%_0,100%_78%,50%_100%,0_78%)] bg-[#2B475D] min-h-[1.5rem]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
