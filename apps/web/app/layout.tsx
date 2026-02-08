import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/lib/query-provider';
import { ThemeClassApplier } from '@/components/theme-class-applier';
import { BreadcrumbProvider } from '@/lib/breadcrumb-context';
import { Header } from '@/components/header';
import { GlobalBreadcrumb } from '@/components/global-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'ShopAcc - Mua bán acc game uy tín',
  description: 'Chuyên mua bán acc game Liên Quân, Free Fire, PUBG, Genshin Impact và nhiều game khác. Giao dịch nhanh, an toàn, giá rẻ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=JSON.parse(localStorage.getItem('shop-ban-acc-store'));var t=d&&d.state&&d.state.themePreset;if(t&&t!=='default')document.documentElement.classList.add('theme-'+t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <ThemeClassApplier>
              <BreadcrumbProvider>
                <Header />
                <GlobalBreadcrumb />
                <main className="flex-1">{children}</main>
                <Footer />
              </BreadcrumbProvider>
              <Toaster position="top-center" richColors closeButton />
            </ThemeClassApplier>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
