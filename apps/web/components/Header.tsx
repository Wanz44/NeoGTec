'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, ArrowRight, Video } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Éviter les Risques', path: '/risques' },
    { name: 'Nos Solutions', path: '/solutions' },
    { name: '16 Modules SaaS', path: '/modules' },
    { name: 'FAQ DRH', path: '/faq' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#00A86B] text-white transition-transform group-hover:scale-105 shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">
            Neo<span className="text-[#00A86B]">GTec</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-semibold transition-colors duration-200 hover:text-[#00A86B] ${
                isActive(item.path) ? 'text-[#00A86B]' : 'text-slate-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/affiliation"
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#00A86B] px-5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00A86B]/10 active:scale-95"
          >
            S’affilier en 5 min
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-[8px] text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Menu principal"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-bold py-2 border-b border-slate-50 ${
                  isActive(item.path) ? 'text-[#00A86B]' : 'text-slate-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/affiliation"
                onClick={() => setIsOpen(false)}
                className="flex h-11 items-center justify-center rounded-[8px] bg-[#00A86B] text-sm font-bold text-white shadow-md"
              >
                S’affilier en 5 min
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
