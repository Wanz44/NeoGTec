import React from 'react';

export const Card = ({ children, className = '' }: any) => (
  <div className={`rounded-xl border bg-white p-4 ${className}`}>{children}</div>
);

export const Text = ({ children, className = '' }: any) => (
  <p className={`text-xs text-slate-500 ${className}`}>{children}</p>
);

export const Metric = ({ children, className = '' }: any) => (
  <span className={`text-2xl font-bold text-slate-900 ${className}`}>{children}</span>
);

export const BadgeDelta = ({ children, className = '' }: any) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${className}`}>{children}</span>
);

export const AreaChart = ({ className = '' }: any) => (
  <div className={`w-full bg-emerald-50/50 rounded-lg border border-emerald-100 ${className}`} />
);
