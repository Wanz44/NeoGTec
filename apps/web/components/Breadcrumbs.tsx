'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface BreadcrumbsProps {
  currentPageName: string;
}

export function Breadcrumbs({ currentPageName }: BreadcrumbsProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-xs font-bold text-[#0F172A] transition-all hover:bg-slate-50 hover:scale-[1.01] active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-[#00A86B]" />
          <span>Retour</span>
        </button>

        {/* Trail */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#00A86B] transition-colors">
            Accueil
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[#0F172A] font-bold">{currentPageName}</span>
        </nav>
      </div>
    </div>
  );
}
