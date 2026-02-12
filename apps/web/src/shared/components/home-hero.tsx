'use client';

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';

export function HomeHero({ accLabel }: { accLabel: string }) {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    router.push(q ? `/games?q=${encodeURIComponent(q)}` : '/games');
  };

  return (
    <section className="relative py-24 text-center container-narrow overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/15 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 blur-[80px] rounded-full pointer-events-none -z-10" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-destructive/25 blur-[120px] rounded-full pointer-events-none -z-10 [animation:var(--animate-hero-glow-pulse)]"
        aria-hidden
      />

      <Badge
        variant="outline"
        className="mb-6 border-primary/30 text-primary bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-sm"
      >
        {accLabel}
      </Badge>

      <h1
        id="hero-heading"
        className="text-fluid-hero font-bold tracking-tight mb-6 drop-shadow-sm"
      >
        Mua Acc Game <br className="sm:hidden" />
        <span className="text-primary glow-text">Giá Tốt Nhất</span>
      </h1>

      <p className="text-muted-foreground max-w-[90vw] sm:max-w-xl mx-auto mb-2 text-lg">
        Hệ thống bán acc tự động lớn nhất Việt Nam.
      </p>
      <p className="text-muted-foreground/80 max-w-[90vw] sm:max-w-xl mx-auto text-sm mb-10">
        Giao dịch trung gian an toàn · Bảo hành 100% đúng mô tả
      </p>

      <form
        onSubmit={handleSearch}
        className="relative z-10 mt-8 max-w-lg mx-auto flex gap-3 p-1.5 bg-background/40 backdrop-blur-md rounded-xl border border-primary/20 shadow-2xl"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="search"
            placeholder="Tìm tên game (VD: Lien Quan, Roblox)..."
            className="w-full pl-10 h-12 bg-transparent border-transparent focus-visible:ring-0 focus-visible:bg-background/50 transition-all placeholder:text-muted-foreground/50 text-base"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            aria-label="Tìm game"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-shadow"
        >
          Tìm Kiếm
        </Button>
      </form>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/games">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            Xem tất cả {accLabel.split(' ')[0]} acc{' '}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
