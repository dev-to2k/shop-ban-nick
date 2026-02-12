'use client';

import { formatPrice } from '@shop-ban-nick/shared-utils';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  Gamepad2,
  History,
  Home,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Package,
  Shield,
  ShoppingCart,
  Sun,
  User,
  UserPlus,
  Wallet,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { api, queryKeys } from '@shared/api';
import { useCart } from '@shared/contexts';
import { useAppStore } from '@shared/utils';
import { Badge } from './badge';
import { Button } from './button';

const headerCls = {
  root: 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground',
  border: 'border-b-2 border-primary',
  hover: 'hover:bg-primary/10 hover:text-primary',
  badge: 'bg-primary text-primary-foreground',
  btnPrimary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm',
  drawerBorder: 'border-l-2 border-primary',
  drawerPanel: 'bg-background text-foreground',
  drawerDivider: 'border-border',
  drawerUserBg: 'bg-primary/10',
  drawerUserIcon: 'text-primary',
  navItemBase:
    'relative text-sm font-medium py-2 px-3 rounded-md transition-colors duration-150',
  navItemInactive:
    'text-muted-foreground hover:bg-primary/10 hover:text-primary',
  navItemActive: 'text-primary',
  navItemLine:
    'absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left transition-transform duration-200',
};

export function Header() {
  const pathname = usePathname();
  const { auth, logout } = useAppStore();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isHomeActive = pathname === '/';
  const isGamesActive = pathname === '/games' || pathname.startsWith('/games/');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  const { data: wallet } = useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => api.getWallet(),
    enabled: !!auth.user,
  });

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = mounted && resolvedTheme === 'dark';
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  return (
    <>
      <header
        className={`z-50 w-full shadow-sm ${headerCls.root} ${headerCls.border}`}
      >
        <div className="container-narrow flex h-16 min-h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-inherit hover:opacity-90"
          >
            <Gamepad2 className="h-6 w-6" />
            <span>ShopAcc</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`${headerCls.navItemBase} ${isHomeActive ? headerCls.navItemActive : headerCls.navItemInactive}`}
            >
              Trang chủ
              <span
                className={`${headerCls.navItemLine} ${isHomeActive ? 'scale-x-100' : 'scale-x-0'}`}
                aria-hidden
              />
            </Link>
            <Link
              href="/games"
              className={`${headerCls.navItemBase} ${isGamesActive ? headerCls.navItemActive : headerCls.navItemInactive}`}
            >
              Danh sách game
              <span
                className={`${headerCls.navItemLine} ${isGamesActive ? 'scale-x-100' : 'scale-x-0'}`}
                aria-hidden
              />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle only shown for guests */}
            {!auth.user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                <Sun
                  className={`h-5 w-5 shrink-0 ${isDark ? 'hidden' : 'block'}`}
                  aria-hidden
                />
                <Moon
                  className={`h-5 w-5 shrink-0 ${isDark ? 'block' : 'hidden'}`}
                  aria-hidden
                />
              </Button>
            )}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={`relative text-inherit ${headerCls.hover}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.reduce((s, i) => s + (i.quantity ?? 1), 0) > 0 && (
                  <Badge
                    className={`absolute -top-px -right-px h-5 min-w-5 flex items-center justify-center p-0 text-[0.625rem] border-0 ${headerCls.badge}`}
                  >
                    {cart.reduce((s, i) => s + (i.quantity ?? 1), 0)}
                  </Badge>
                )}
              </Button>
            </Link>

            {auth.user ? (
              <div className="hidden md:flex items-center gap-1">
                {auth.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`text-inherit ${headerCls.hover} h-8 w-8`}
                      title="Admin"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link href="/orders">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-inherit ${headerCls.hover} h-8 w-8`}
                    title="Đơn hàng"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-inherit ${headerCls.hover}`}
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${headerCls.drawerUserBg}`}
                    >
                      <User
                        className={`h-3.5 w-3.5 ${headerCls.drawerUserIcon}`}
                      />
                    </div>
                    <span className="max-w-20 truncate ml-1.5 text-xs">
                      {auth.user.name}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 ml-1 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </Button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-background shadow-lg z-50 py-2">
                      {/* Profile link */}
                      <Link
                        href="/profile"
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm ${headerCls.hover}`}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {auth.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            {formatPrice(wallet?.balance ?? 0)}
                          </p>
                        </div>
                      </Link>

                      <div className="h-px bg-border my-1" />

                      {/* Dark mode toggle */}
                      <button
                        type="button"
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left ${headerCls.hover}`}
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                      >
                        {isDark ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                        <span>{isDark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
                      </button>

                      <div className="h-px bg-border my-1" />

                      {/* Logout */}
                      <button
                        type="button"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-inherit ${headerCls.hover}`}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className={headerCls.btnPrimary}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden text-inherit ${headerCls.hover}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mounted &&
          createPortal(
            <div
              className={`md:hidden fixed inset-0 z-9999 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
              aria-hidden={!mobileOpen}
            >
              <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={closeDrawer}
              />
              <div
                className={`fixed top-0 right-0 h-full w-[min(17.5rem,85vw)] shadow-2xl flex flex-col transition-transform duration-200 ease-out ${headerCls.drawerPanel} ${headerCls.drawerBorder} ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
              >
                <div
                  className={`flex items-center justify-between p-4 border-b ${headerCls.drawerDivider}`}
                >
                  <span className="font-semibold">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-inherit ${headerCls.hover}`}
                    onClick={closeDrawer}
                    aria-label="Đóng menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {auth.user && (
                  <div
                    className={`p-4 border-b flex items-center gap-3 ${headerCls.drawerDivider}`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${headerCls.drawerUserBg}`}
                    >
                      <User
                        className={`h-5 w-5 shrink-0 ${headerCls.drawerUserIcon}`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {auth.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {auth.user.email}
                      </p>
                      <p className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-primary tabular-nums">
                        <Wallet className="h-3.5 w-3.5 shrink-0" />
                        {formatPrice(wallet?.balance ?? 0)}
                      </p>
                    </div>
                  </div>
                )}
                <nav className="p-4 flex flex-col gap-1">
                  <Link
                    href="/"
                    className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium ${isHomeActive ? headerCls.navItemActive : `text-inherit ${headerCls.hover}`}`}
                    onClick={closeDrawer}
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    Trang chủ
                  </Link>
                  <Link
                    href="/games"
                    className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium ${isGamesActive ? headerCls.navItemActive : `text-inherit ${headerCls.hover}`}`}
                    onClick={closeDrawer}
                  >
                    <Gamepad2 className="h-5 w-5 shrink-0" />
                    Danh sách game
                  </Link>
                  {auth.user ? (
                    <>
                      <Link
                        href="/profile"
                        className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-inherit ${headerCls.hover}`}
                        onClick={closeDrawer}
                      >
                        <User className="h-5 w-5 shrink-0" />
                        Tài khoản
                      </Link>
                      <Link
                        href="/profile/transactions"
                        className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-inherit ${headerCls.hover}`}
                        onClick={closeDrawer}
                      >
                        <History className="h-5 w-5 shrink-0" />
                        Lịch sử giao dịch
                      </Link>
                      {auth.user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-inherit ${headerCls.hover}`}
                          onClick={closeDrawer}
                        >
                          <Shield className="h-5 w-5 shrink-0" />
                          Admin
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-inherit ${headerCls.hover}`}
                        onClick={closeDrawer}
                      >
                        <Package className="h-5 w-5 shrink-0" />
                        Đơn hàng
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full justify-start"
                        onClick={() => {
                          logout();
                          closeDrawer();
                        }}
                      >
                        <LogOut className="h-5 w-5 shrink-0" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium text-inherit ${headerCls.hover}`}
                        onClick={closeDrawer}
                      >
                        <LogIn className="h-5 w-5 shrink-0" />
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className={`flex items-center gap-3 py-3 px-3 rounded-md text-sm font-medium ${headerCls.btnPrimary}`}
                        onClick={closeDrawer}
                      >
                        <UserPlus className="h-5 w-5 shrink-0" />
                        Đăng ký
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>,
            document.body,
          )}
      </header>
    </>
  );
}
