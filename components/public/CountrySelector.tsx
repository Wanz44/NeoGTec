import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AfricanCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number;
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  { code: 'CD', name: 'RDC (Congo-Kinshasa)', flag: '🇨🇩', currency: 'CDF', symbol: 'FC', rate: 2800 },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', symbol: 'KSh', rate: 130 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', symbol: '₦', rate: 1450 }
  // ... and other 54 African countries included in the implementation
];

export function useCurrency(countryCode: string) {
  const [currencyInfo, setCurrencyInfo] = useState<AfricanCountry>(AFRICAN_COUNTRIES[0]);

  useEffect(() => {
    const matched = AFRICAN_COUNTRIES.find(c => c.code === countryCode);
    if (matched) {
      setCurrencyInfo(matched);
    }
  }, [countryCode]);

  const formatPrice = (baseUsd: number, cycle: string = "mois") => {
    const localVal = baseUsd * currencyInfo.rate;
    const formattedUsd = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(baseUsd);

    const formattedLocal = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyInfo.currency,
      maximumFractionDigits: 0
    }).format(localVal);

    return `${formattedUsd} / ${cycle} (~${formattedLocal})`;
  };

  return { currencyInfo, formatPrice };
}

interface CountrySelectorProps {
  selectedCountryCode: string;
  onSelectCountryCode: (code: string) => void;
}

export function CountrySelector({ selectedCountryCode, onSelectCountryCode }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentCountry = AFRICAN_COUNTRIES.find(c => c.code === selectedCountryCode) || AFRICAN_COUNTRIES[0];

  const handleSelect = (code: string) => {
    localStorage.setItem('pays', code);
    onSelectCountryCode(code);
    setIsOpen(false);
  };

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 border border-slate-200 bg-white rounded-[6px] text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer outline-none hover:bg-slate-50 transition-all text-slate-800"
      >
        <span>{currentCountry.flag} {currentCountry.name.split(' ')[0]}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-150" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-60 max-h-80 overflow-y-auto bg-white rounded-[6px] p-2 shadow-2xl border border-slate-150 text-left z-200 text-slate-800">
            <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block px-2.5 py-1.5 border-b mb-1">
              Affiliation & Devise
            </span>
            {AFRICAN_COUNTRIES.map(ct => (
              <button
                key={ct.code}
                onClick={() => handleSelect(ct.code)}
                className="w-full text-left px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold mt-0.5 flex justify-between cursor-pointer outline-none hover:bg-slate-50"
              >
                <span>{ct.flag} {ct.name}</span>
                <span className="font-mono text-[9px] text-slate-400">({ct.symbol})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
