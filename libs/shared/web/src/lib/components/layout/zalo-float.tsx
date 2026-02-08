'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { contact } from '../../config';

export function ZaloFloat() {
  if (!contact.zaloUrl) return null;
  return (
    <Link
      href={contact.zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-[#0068FF] text-white shadow-lg hover:scale-105 transition-transform"
      aria-label="Chat Zalo"
    >
      <MessageCircle className="h-7 w-7" />
    </Link>
  );
}
