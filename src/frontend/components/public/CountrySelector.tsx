import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface AfricanCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number; // 1 USD = rate
}

export const AFRICAN_COUNTRIES: AfricanCountry[] = [
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', currency: 'DZD', symbol: 'DA', rate: 135 },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', currency: 'AOA', symbol: 'Kz', rate: 830 },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', currency: 'BWP', symbol: 'P', rate: 13.5 },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF', symbol: 'FBu', rate: 2850 },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'CV', name: 'Cap-Vert', flag: '🇨🇻', currency: 'CVE', symbol: 'Esc', rate: 102 },
  { code: 'CF', name: 'République Centrafricaine', flag: '🇨🇫', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'KM', name: 'Comores', flag: '🇰🇲', currency: 'KMF', symbol: 'CF', rate: 450 },
  { code: 'CD', name: 'RDC (Congo-Kinshasa)', flag: '🇨🇩', currency: 'CDF', symbol: 'FC', rate: 2800 },
  { code: 'CG', name: 'Congo-Brazzaville', flag: '🇨🇬', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'CI', name: 'Côte d’Ivoire', flag: '🇨🇮', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', currency: 'DJF', symbol: 'Fdj', rate: 177.7 },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', currency: 'EGP', symbol: 'E£', rate: 47 },
  { code: 'GQ', name: 'Guinée Équatoriale', flag: '🇬🇶', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'ER', name: 'Érythrée', flag: '🇪🇷', currency: 'ERN', symbol: 'Nfk', rate: 15 },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', currency: 'SZL', symbol: 'L', rate: 18.5 },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', currency: 'ETB', symbol: 'Br', rate: 57 },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', currency: 'XAF', symbol: 'FCFA', rate: 605 },
  { code: 'GM', name: 'Gambie', flag: '🇬🇲', currency: 'GMD', symbol: 'D', rate: 68 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', symbol: 'GH₵', rate: 14 },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', currency: 'GNF', symbol: 'FG', rate: 8600 },
  { code: 'GW', name: 'Guinée-Bissau', flag: '🇬🇼', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', symbol: 'KSh', rate: 130 },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', currency: 'LSL', symbol: 'L', rate: 18.5 },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', currency: 'LRD', symbol: 'L$', rate: 194 },
  { code: 'LY', name: 'Libye', flag: '🇱🇾', currency: 'LYD', symbol: 'LD', rate: 4.8 },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', currency: 'MGA', symbol: 'Ar', rate: 4500 },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', currency: 'MWK', symbol: 'MK', rate: 1730 },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'MR', name: 'Mauritanie', flag: '🇲🇷', currency: 'MRU', symbol: 'UM', rate: 39.5 },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', currency: 'MUR', symbol: '₨', rate: 46 },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', currency: 'MAD', symbol: 'DH', rate: 10 },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', currency: 'MZN', symbol: 'MT', rate: 63.8 },
  { code: 'NA', name: 'Namibie', flag: '🇳🇦', currency: 'NAD', symbol: 'N$', rate: 18.5 },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', symbol: '₦', rate: 1450 },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', symbol: 'FRw', rate: 1290 },
  { code: 'ST', name: 'Sao Tomé-et-Principe', flag: '🇸🇹', currency: 'STN', symbol: 'Db', rate: 22.8 },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', currency: 'SCR', symbol: 'SR', rate: 13.5 },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', currency: 'SLE', symbol: 'Le', rate: 22.5 },
  { code: 'SO', name: 'Somalie', flag: '🇸🇴', currency: 'SOS', symbol: 'Sh.So.', rate: 570 },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', currency: 'ZAR', symbol: 'R', rate: 18.5 },
  { code: 'SS', name: 'Soudan du Sud', flag: '🇸🇸', currency: 'SSP', symbol: 'SSP', rate: 1000 },
  { code: 'SD', name: 'Soudan', flag: '🇸🇩', currency: 'SDG', symbol: 'LS', rate: 600 },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', currency: 'TZS', symbol: 'TSh', rate: 2580 },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', currency: 'XOF', symbol: 'FCFA', rate: 605 },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', currency: 'TND', symbol: 'DT', rate: 3.1 },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', currency: 'UGX', symbol: 'USh', rate: 3800 },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', currency: 'ZMW', symbol: 'ZK', rate: 25 },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', currency: 'ZWL', symbol: 'Z$', rate: 360 }
];

export function useCurrency(countryCode: string) {
  const [currencyInfo, setCurrencyInfo] = useState<AfricanCountry>(AFRICAN_COUNTRIES.find(c => c.code === 'CD')!);

  useEffect(() => {
    const matched = AFRICAN_COUNTRIES.find(c => c.code === countryCode);
    if (matched) {
      setCurrencyInfo(matched);
    }
  }, [countryCode]);

  const formatPrice = (baseUsd: number, cycle: string = "mois") => {
    // Si pays RDC, on peut aussi lister en CDF et USD
    const localVal = baseUsd * currencyInfo.rate;
    const formattedUsd = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(baseUsd);

    if (currencyInfo.code === 'US') {
      return `${formattedUsd} / ${cycle}`;
    }

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
  const currentCountry = AFRICAN_COUNTRIES.find(c => c.code === selectedCountryCode) || AFRICAN_COUNTRIES.find(c => c.code === 'CD')!;

  const handleSelect = (code: string) => {
    localStorage.setItem('pays', code);
    onSelectCountryCode(code);
    setIsOpen(false);
    
    // GTM track event
    console.log('GTM event: change_country to ' + code);
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'change_country', country: code });
    }
  };

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 border border-slate-205 bg-slate-50 text-slate-705 sm:border-white/10 sm:bg-white/5 sm:text-white rounded-[6px] text-[11px] font-bold uppercase flex items-center gap-1.5 cursor-pointer outline-none hover:bg-slate-100 sm:hover:bg-white/10 transition-all"
      >
        <span>{currentCountry.flag} {currentCountry.name.split(' ')[0]}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {currentCountry.code !== 'CD' && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-[#00A86B]" title="Présent dans 12 pays" />
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-150" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-60 max-h-80 overflow-y-auto bg-white rounded-[6px] p-2 shadow-2xl border border-slate-150 text-left z-200 text-slate-800 custom-scrollbar">
            <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block px-2.5 py-1.5 border-b mb-1">
              Affiliation & Devise (54 Pays)
            </span>
            {AFRICAN_COUNTRIES.map(ct => (
              <button
                key={ct.code}
                onClick={() => handleSelect(ct.code)}
                className="w-full text-left px-2.5 py-1.5 rounded-[5px] text-[11px] font-bold transition-all mt-0.5 flex justify-between items-center select-none cursor-pointer outline-none hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <span>{ct.flag}</span>
                  <span className="truncate max-w-[120px]">{ct.name}</span>
                </span>
                <span className="font-mono text-[9px] text-slate-400">({ct.symbol})</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
