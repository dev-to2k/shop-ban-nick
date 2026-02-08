'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const AlertDialogContext = React.createContext<{ onOpenChange?: (open: boolean) => void; open?: boolean }>({});
const AlertDialogContentContext = React.createContext<{ requestClose?: () => void }>({});

function AlertDialog({ onOpenChange, open, children, ...rest }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return (
    <AlertDialogPrimitive.Root onOpenChange={onOpenChange} open={open} {...rest}>
      <AlertDialogContext.Provider value={{ onOpenChange, open }}>{children}</AlertDialogContext.Provider>
    </AlertDialogPrimitive.Root>
  );
}
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, onClick, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
    onClick={onClick}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const SHEET_OUT_MS = 240;

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, onPointerDownOutside, children, ...props }, ref) => {
  const { onOpenChange, open } = React.useContext(AlertDialogContext);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (open) setIsExiting(false);
  }, [open]);

  React.useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)');
    setIsMobile(m.matches);
    const h = () => setIsMobile(m.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);

  React.useEffect(() => () => { if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current); }, []);

  const requestClose = React.useCallback(() => {
    if (isMobile) {
      setIsExiting(true);
      closeTimeoutRef.current = setTimeout(() => {
        closeTimeoutRef.current = null;
        onOpenChange?.(false);
      }, SHEET_OUT_MS);
    } else {
      onOpenChange?.(false);
    }
  }, [isMobile, onOpenChange]);

  const handlePointerDownOutside = React.useCallback(
    (e: React.PointerDownOutsideEvent) => {
      onPointerDownOutside?.(e);
      requestClose();
    },
    [onPointerDownOutside, requestClose]
  );

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay onClick={requestClose} />
      <AlertDialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={handlePointerDownOutside}
        className={cn(
          'fixed z-50 grid gap-4 border bg-background shadow-lg overflow-y-auto',
          'max-h-[min(92dvh,calc(100dvh-1rem))]',
          'inset-x-0 bottom-0 w-full rounded-t-xl border-b-0 p-4 pb-[max(2rem,calc(1rem+env(safe-area-inset-bottom)))]',
          isExiting && isMobile && 'alert-dialog-sheet-out',
          !isExiting && 'max-md:data-[state=open]:animate-[sheet-in_0.22s_ease-out] max-md:data-[state=closed]:translate-y-full',
          'md:inset-auto md:left-[50%] md:top-[50%] md:bottom-auto md:right-auto md:w-[calc(100%-2rem)] md:max-w-lg md:translate-x-[-50%] md:translate-y-[-50%] md:rounded-xl md:border-b md:p-6',
          'md:data-[state=open]:translate-x-[-50%] md:data-[state=open]:translate-y-[-50%] md:data-[state=closed]:translate-x-[-50%] md:data-[state=closed]:translate-y-[-50%]',
          'md:data-[state=open]:animate-in md:data-[state=closed]:animate-out md:data-[state=closed]:fade-out-0 md:data-[state=open]:fade-in-0 md:data-[state=closed]:zoom-out-95 md:data-[state=open]:zoom-in-95 md:data-[state=closed]:slide-out-to-left-1/2 md:data-[state=closed]:slide-out-to-top-[48%] md:data-[state=open]:slide-in-from-left-1/2 md:data-[state=open]:slide-in-from-top-[48%]',
          className
        )}
        {...props}
      >
        <AlertDialogContentContext.Provider value={{ requestClose }}>{children}</AlertDialogContentContext.Provider>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center md:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse md:flex-row md:justify-end md:gap-2', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, onClick, ...props }, ref) => {
  const { requestClose } = React.useContext(AlertDialogContentContext);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (requestClose) {
      requestClose();
      onClick?.(e);
    } else {
      onClick?.(e);
    }
  };
  if (requestClose) {
    return (
      <button
        type="button"
        ref={ref}
        className={cn('mt-2 md:mt-0', buttonVariants({ variant: 'outline' }), className)}
        onClick={handleClick}
        {...props}
      />
    );
  }
  return (
    <AlertDialogPrimitive.Cancel ref={ref} className={cn('mt-2 md:mt-0', buttonVariants({ variant: 'outline' }), className)} onClick={onClick} {...props} />
  );
});
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
