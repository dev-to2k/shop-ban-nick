'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { ShoppingCart, Menu, X, Gamepad2, Shield, Package, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAppStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export function Header() {
  const { cart, auth, logout } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span>ShopAcc</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
            Danh sách game
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </Link>

          {auth.user ? (
            <div className="hidden md:flex items-center gap-2">
              {auth.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm"><Shield className="h-4 w-4 mr-2" />Admin</Button>
                </Link>
              )}
              <Link href="/orders">
                <Button variant="ghost" size="sm"><Package className="h-4 w-4 mr-2" />Đơn hàng</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}><LogOut className="h-4 w-4 mr-2" />Đăng xuất</Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm"><LogIn className="h-4 w-4 mr-2" />Đăng nhập</Button>
              </Link>
              <Link href="/register">
                <Button size="sm"><UserPlus className="h-4 w-4 mr-2" />Đăng ký</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <div
            className={`md:hidden fixed inset-0 z-[9999] ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            aria-hidden={!mobileOpen}
          >
            <div
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
              onClick={closeDrawer}
            />
            <div
              className={`fixed top-0 right-0 h-full w-[min(280px,85vw)] bg-background border-l shadow-2xl flex flex-col transition-transform duration-200 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold">Menu</span>
                <Button variant="ghost" size="icon" onClick={closeDrawer} aria-label="Đóng menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="p-4 flex flex-col gap-1">
                <Link href="/games" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium hover:bg-accent" onClick={closeDrawer}>
                  <Gamepad2 className="h-5 w-5 shrink-0" />Danh sách game
                </Link>
                {auth.user ? (
                  <>
                    {auth.user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium hover:bg-accent" onClick={closeDrawer}>
                        <Shield className="h-5 w-5 shrink-0" />Admin
                      </Link>
                    )}
                    <Link href="/orders" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium hover:bg-accent" onClick={closeDrawer}>
                      <Package className="h-5 w-5 shrink-0" />Đơn hàng
                    </Link>
                    <button type="button" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left" onClick={() => { logout(); closeDrawer(); }}>
                      <LogOut className="h-5 w-5 shrink-0" />Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium hover:bg-accent" onClick={closeDrawer}>
                      <LogIn className="h-5 w-5 shrink-0" />Đăng nhập
                    </Link>
                    <Link href="/register" className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium hover:bg-accent" onClick={closeDrawer}>
                      <UserPlus className="h-5 w-5 shrink-0" />Đăng ký
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
