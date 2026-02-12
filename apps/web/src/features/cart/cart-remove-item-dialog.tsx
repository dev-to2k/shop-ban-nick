'use client';

import { Trash2, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/components';

interface CartRemoveItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTitle: string | null;
  onConfirm: () => void;
}

export function CartRemoveItemDialog({ open, onOpenChange, itemTitle, onConfirm }: CartRemoveItemDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa khỏi giỏ hàng?</AlertDialogTitle>
          <AlertDialogDescription>
            {itemTitle ? `Xóa "${itemTitle}" khỏi giỏ hàng?` : 'Bạn có chắc muốn xóa?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel><X className="h-4 w-4 mr-2" />Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4 mr-2" />Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
