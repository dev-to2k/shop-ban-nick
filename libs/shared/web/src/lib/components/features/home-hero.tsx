'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

export function HomeHero({ accLabel }: { accLabel: string }) {
  const router = useRouter();
  const [searchQ, setSearchQ] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQ.trim();
    router.push(q ? `/games?q=${encodeURIComponent(q)}` : '/games');
  };

  return (
    <section className="py-8 text-center container-narrow" aria-labelledby="hero-heading">
      <Badge variant="secondary" className="mb-3">{accLabel}</Badge>
      <h1 id="hero-heading" className="text-fluid-hero font-bold tracking-tight mb-3">
        Mua Acc Game <span className="text-primary">Giá Tốt Nhất</span>
      </h1>
      <p className="text-muted-foreground max-w-[90vw] sm:max-w-xl mx-auto mb-1">
        Giao acc trong 5 phút – Bảo hành 24h.
      </p>
      <p className="text-muted-foreground max-w-[90vw] sm:max-w-xl mx-auto text-sm">
        {accLabel} · Giao dịch tức thì.
      </p>
      <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Tìm game theo tên..."
            className="w-full"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            aria-label="Tìm game"
          />
        </div>
        <Button type="submit"><Search className="h-4 w-4 shrink-0" /> Tìm</Button>
      </form>
      <div className="mt-4">
        <Link href="/games">
          <Button size="lg">
            Xem acc ngay <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
