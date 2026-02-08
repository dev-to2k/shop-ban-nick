'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gamepad2, Package, ShoppingCart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/games', label: 'Games', icon: Gamepad2 },
  { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { auth } = useAppStore();

  if (!auth.user || auth.user.role !== 'ADMIN') {
    return (
      <div className="container-narrow py-16 sm:py-20 text-center">
        <p className="text-muted-foreground mb-4">Bạn không có quyền truy cập trang này</p>
        <Link href="/"><Button><Home className="h-4 w-4 mr-2" />Về trang chủ</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 border-r bg-muted/30 p-4 hidden md:block">
        <h2 className="font-bold text-lg mb-4">Admin</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn('w-full justify-start', pathname === item.href && 'bg-muted')}
                size="sm"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
    </div>
  );
}
