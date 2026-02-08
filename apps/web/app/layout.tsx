import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import {
  ThemeProvider,
  QueryProvider,
  BreadcrumbProvider,
  CartProvider,
  ThemeClassApplier,
  GlobalMutationLoading,
  Header,
  StickyStack,
  GlobalBreadcrumb,
  Footer,
  ScrollToTop,
  ZaloFloat,
} from '@shop-ban-nick/shared-web';

export const metadata: Metadata = {
  title: 'ShopAcc - Mua bán acc game uy tín',
  description:
    'Chuyên mua bán acc game Liên Quân, Free Fire, PUBG, Genshin Impact và nhiều game khác. Giao dịch nhanh, an toàn, giá rẻ.',
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'ShopAcc',
      url: APP_URL,
      description:
        'Mua bán acc game uy tín - Liên Quân, Free Fire, PUBG, Genshin Impact.',
    },
    {
      '@type': 'WebSite',
      name: 'ShopAcc',
      url: APP_URL,
      description: 'Chuyên mua bán acc game. Giao dịch nhanh, an toàn, giá rẻ.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col antialiased`}
      >
        <NextTopLoader
          height={3}
          showSpinner={false}
          color="hsl(var(--primary))"
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider extra={<GlobalMutationLoading />}>
            <ThemeClassApplier>
              <CartProvider>
                <BreadcrumbProvider>
                  <StickyStack>
                    <Header />
                    <GlobalBreadcrumb />
                  </StickyStack>
                  <main className="flex-1">{children}</main>
                  <Footer />
                </BreadcrumbProvider>
              </CartProvider>
              <Toaster position="top-center" richColors closeButton />
              <ScrollToTop />
              <ZaloFloat />
            </ThemeClassApplier>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
