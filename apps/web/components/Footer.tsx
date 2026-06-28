'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, Shield, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  const [selectedCountry, setSelectedCountry] = useState('CD');

  const countries = [
    { code: 'CD', name: 'RDC (Kinshasa)', currency: 'CDF / USD', rate: '2800 FC = 1 USD' },
    { code: 'KE', name: 'Kenya (Nairobi)', currency: 'KES', rate: '130 KES = 1 USD' },
    { code: 'NG', name: 'Nigeria (Lagos)', currency: 'NGN', rate: '1500 NGN = 1 USD' },
    { code: 'CI', name: 'Côte d’Ivoire (Abidjan)', currency: 'XOF', rate: '600 FCFA = 1 USD' },
    { code: 'SN', name: 'Sénégal (Dakar)', currency: 'XOF', rate: '600 FCFA = 1 USD' },
    { code: 'CM', name: 'Cameroun (Douala)', currency: 'XAF', rate: '600 FCFA = 1 USD' },
    { code: 'CG', name: 'Congo-Brazzaville', currency: 'XAF', rate: '600 FCFA = 1 USD' },
    { code: 'AO', name: 'Angola (Luanda)', currency: 'AOA', rate: '850 AOA = 1 USD' },
    { code: 'TZ', name: 'Tanzanie (Dar es Salaam)', currency: 'TZS', rate: '2600 TZS = 1 USD' },
    { code: 'UG', name: 'Ouganda (Kampala)', currency: 'UGX', rate: '3700 UGX = 1 USD' },
    { code: 'RW', name: 'Rwanda (Kigali)', currency: 'RWF', rate: '1300 RWF = 1 USD' },
    { code: 'GH', name: 'Ghana (Accra)', currency: 'GHS', rate: '14 GHS = 1 USD' },
  ];

  const activeCountry = countries.find(c => c.code === selectedCountry) || countries[0];

  const handleAlertPrivacy = () => {
    alert("Politique de Confidentialité Conforme aux Lois Africaines : Vos données personnelles sont cryptées. Aucune revente commerciale.");
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 text-[#0F172A]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-[#00A86B] font-extrabold text-base uppercase">
              <div className="w-7 h-7 bg-[#00A86B] text-white rounded-[6px] flex items-center justify-center font-bold text-sm">N</div>
              <span>NeoGTec SaaS</span>
            </Link>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xs">
              NeoGTec facilite la gestion de vos cartes de santé d’entreprise. 
              Moins de tracas, plus de soin pour vos équipes. En toute conformité. 
            </p>
            <div className="text-[10px] font-mono text-slate-400 space-y-1">
              <p>📍 Enregistrement : NeoGTec SARL</p>
              <p>📂 RCCM : CD/KIN/RCCM/24-B-08310</p>
              <p>🛡️ Identification : ID. NAT. 01-18-N93011B</p>
              <p>📃 Agrément ARCA : CD/KIN/ARCA/DECISION-2026-10492</p>
            </div>
          </div>

          {/* Column 2: Location & Contact */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider block">Bureau Principal</span>
            <div className="flex items-start gap-2 text-xs font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-[#00A86B] mt-0.5 shrink-0" />
              <p>Immeuble BCC, 4ème Étage<br />Avenue du Port, Gombe<br />Kinshasa, RDC</p>
            </div>
            <p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00A86B]" /> contact@neogtec.com
            </p>

            {/* Country Selector */}
            <div className="pt-2">
              <label className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                Sélection du pays d’opération
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="h-8 rounded-[8px] border border-slate-200 bg-white px-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00A86B] cursor-pointer"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <div className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-100 rounded-[6px] px-2 py-1">
                  Devise : {activeCountry.currency} ({activeCountry.rate})
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider block">Mentions Légales</span>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <button 
                  onClick={handleAlertPrivacy}
                  className="hover:text-[#00A86B] flex items-center gap-1.5 text-slate-650 cursor-pointer text-left"
                >
                  Vie Privée (Loi n°18/035) 
                  <ExternalLink className="w-3 w-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAlertPrivacy}
                  className="hover:text-[#00A86B] flex items-center gap-1.5 text-slate-650 cursor-pointer text-left"
                >
                  Charte Ethique & RGPD
                  <ExternalLink className="w-3 w-3 text-slate-400" />
                </button>
              </li>
              <li>
                <div className="text-slate-400 font-medium text-[11px] pt-2">
                  NeoGTec opère en Afrique pour dynamiser l&apos;accès aux soins de santé de vos salariés.
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center text-[11px] font-mono text-slate-400 font-bold">
          <p>© {new Date().getFullYear()} NeoGTec SARL. Tous droits réservés. Agréé ARCA-RDC CD-41098. Données de santé souveraines.</p>
        </div>
      </div>
    </footer>
  );
}
