import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Search, 
  ChevronDown, Building2, HelpCircle, ArrowUpDown
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Tenant {
  id: string;
  name: string;
  region: string;
  mrr: number; // Value in Dollars
  lossRatio: number; // Percentage (Sinistralité)
  delayDays: number; // Days (Délai de traitement)
  status: 'active' | 'suspended';
  sector: 'Santé' | 'Corporate' | 'Automobile' | 'Vie';
}

export const TenantTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'top' | 'flop'>('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');

  const rawTenants: Tenant[] = [
    { id: 'ten-101', name: 'Rawbank Assurance', region: 'RDC', mrr: 45000, lossRatio: 35.8, delayDays: 2.1, status: 'active', sector: 'Santé' },
    { id: 'ten-102', name: 'Congo Telecom Mutuelle', region: 'COG', mrr: 12500, lossRatio: 41.2, delayDays: 3.4, status: 'active', sector: 'Corporate' },
    { id: 'ten-103', name: 'Clinique Ngaliema Staffing', region: 'RDC', mrr: 21000, lossRatio: 78.4, delayDays: 9.8, status: 'active', sector: 'Santé' },
    { id: 'ten-104', name: 'Angola Oil Corp Plan', region: 'AOL', mrr: 68000, lossRatio: 22.1, delayDays: 1.8, status: 'active', sector: 'Corporate' },
    { id: 'ten-105', name: 'Air France Kinshasa Crew', region: 'FR', mrr: 18500, lossRatio: 65.0, delayDays: 8.4, status: 'active', sector: 'Vie' },
    { id: 'ten-106', name: 'Snel RDC Agents', region: 'RDC', mrr: 9400, lossRatio: 82.5, delayDays: 14.2, status: 'active', sector: 'Automobile' },
    { id: 'ten-107', name: 'Sonangol Luanda Team', region: 'AOL', mrr: 51200, lossRatio: 89.4, delayDays: 11.5, status: 'active', sector: 'Automobile' },
    { id: 'ten-108', name: 'Dakar Transit Mutuelle', region: 'SEN', mrr: 15200, lossRatio: 44.5, delayDays: 4.1, status: 'active', sector: 'Vie' },
    { id: 'ten-109', name: 'Brazza Port Services', region: 'COG', mrr: 8800, lossRatio: 90.1, delayDays: 18.0, status: 'suspended', sector: 'Corporate' }
  ];

  // 🧠 SCORE SANTÉ ALGORITHM:
  // Formula: High MRR adds health (+40% max), High Premium Loss decreases health (-30% max), High Claims delay decreases health (-30% max)
  // Evaluated and normalized out of 100
  const evaluateScoreSante = (tenant: Tenant): number => {
    // 1. MRR factor (More than 40k gets 40 points, below gets scaled)
    const mrrScore = Math.min(40, (tenant.mrr / 40000) * 40);
    
    // 2. Loss Ratio factor (80%+ gets 0 points, below gets scaled up to 30 points)
    const lossScore = Math.max(0, 30 - Math.min(30, (tenant.lossRatio / 90) * 30));
    
    // 3. Delay days factor (15 days or more gets 0 points, below gets scaled up to 30 points)
    const delayScore = Math.max(0, 30 - Math.min(30, (tenant.delayDays / 15) * 30));

    // Combine
    const finalVal = Math.round(mrrScore + lossScore + delayScore);
    return Math.min(100, Math.max(0, finalVal));
  };

  // Enhance Tenants array with computed health score
  const enrichedTenants = useMemo(() => {
    return rawTenants.map(tenant => ({
      ...tenant,
      scoreSante: evaluateScoreSante(tenant)
    }));
  }, []);

  // Filter and sort according to tabs (Top vs Flop) and search query
  const processedTenants = useMemo(() => {
    let list = [...enrichedTenants];

    // sector filtering
    if (selectedSector !== 'all') {
      list = list.filter(t => t.sector === selectedSector);
    }

    // search query filter
    if (searchQuery.trim().length > 0) {
      const g = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.name.toLowerCase().includes(g) || 
        t.id.toLowerCase().includes(g) || 
        t.region.toLowerCase().includes(g)
      );
    }

    // sorting parameters based on "Top" and "Flops" tabs
    if (activeTab === 'top') {
      // High score first
      list.sort((a, b) => b.scoreSante - a.scoreSante);
    } else {
      // Low score first (Flops)
      list.sort((a, b) => a.scoreSante - b.scoreSante);
    }

    return list;
  }, [activeTab, searchQuery, selectedSector, enrichedTenants]);

  // Color mappings for health state indicator badges
  const getHealthBadgeStyle = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
      
      {/* Header and Filter sections */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5 shrink-0">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" /> Moniteur des Tenants Multi-SaaS
          </h4>
          <span className="text-[9px] font-mono text-slate-500 block">
            Algorithme de routing: ScoreSanté = mrr (40%) + loss_ratio (30%) + delay_days (30%)
          </span>
        </div>

        {/* Tab Switchers: Top vs Flops */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-850 rounded-xl max-w-xs self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveTab('top')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 outline-none",
              activeTab === 'top' 
                ? "bg-slate-900 border border-slate-800 text-emerald-400 text-white" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top Performance</span>
          </button>
          <button
            onClick={() => setActiveTab('flop')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 outline-none",
              activeTab === 'flop' 
                ? "bg-slate-900 border border-slate-800 text-rose-400 text-white" 
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Flops attention</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 shrink-0">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Rechercher un tenant (ex: Rawbank)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 outline-none transition-colors placeholder:text-slate-600"
          />
        </div>

        {/* Sector filtering */}
        <div className="flex items-center gap-2 self-start sm:self-center w-full sm:w-auto">
          <span className="text-[9px] font-mono font-black uppercase text-slate-500 tracking-wider">Secteur:</span>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer outline-none font-bold"
          >
            <option value="all">Tous les secteurs</option>
            <option value="Santé">🩺 Santé</option>
            <option value="Corporate">🏢 Corporate</option>
            <option value="Automobile">🚗 Automobile</option>
            <option value="Vie">🛡️ Vie</option>
          </select>
        </div>
      </div>

      {/* TABLE VISUAL CONTAINER */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full divide-y divide-slate-850 text-left border-collapse select-text">
          <thead>
            <tr className="text-[10px] uppercase text-slate-500 tracking-widest font-mono">
              <th className="pb-3.5 pl-4 font-bold">Code Tenant / Nom</th>
              <th className="pb-3.5 font-bold">Pays</th>
              <th className="pb-3.5 font-bold text-right">MRR (Mensuel)</th>
              <th className="pb-3.5 font-bold text-right">Sinistralité</th>
              <th className="pb-3.5 font-bold text-right">Délai Règlement</th>
              <th className="pb-3.5 font-bold text-center">ScoreSanté</th>
              <th className="pb-3.5 pr-4 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {processedTenants.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-600 font-mono">
                  Aucun tenant enregistré ne répond aux filtres de recherche.
                </td>
              </tr>
            ) : (
              processedTenants.map((t) => (
                <tr key={t.id} className="text-xs hover:bg-slate-950/20 transition-all duration-150">
                  <td className="py-3.5 pl-4 flex flex-col justify-center">
                    <span className="font-extrabold text-white text-xs">{t.name}</span>
                    <span className="text-[9px] font-mono text-slate-605 mt-0.5">{t.id} • {t.sector}</span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-400 uppercase tracking-widest">
                    <span>{t.region === 'RDC' ? '🇨🇩' : t.region === 'FR' ? '🇫🇷' : t.region === 'AOL' ? '🇦🇴' : '🇨🇬'} {t.region}</span>
                  </td>
                  <td className="py-3.5 text-right font-black text-slate-200 font-mono">
                    {t.mrr.toLocaleString('fr-FR')} $
                  </td>
                  <td className="py-3.5 text-right font-semibold font-mono text-slate-350">
                    {t.lossRatio}%
                  </td>
                  <td className="py-3.5 text-right font-semibold font-mono text-slate-350">
                    {t.delayDays} jours
                  </td>
                  {/* ScoreSanté Visual cell */}
                  <td className="py-3.5 text-center">
                    <div className="flex justify-center">
                      <span className={cn(
                        "font-black font-mono text-[10px] px-2 py-0.5 rounded-lg border uppercase tracking-wider",
                        getHealthBadgeStyle(t.scoreSante)
                      )}>
                        {t.scoreSante} %
                      </span>
                    </div>
                  </td>
                  {/* Status column */}
                  <td className="py-3.5 pr-4 text-center">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      t.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
                    )} title={t.status === 'active' ? 'Client En ligne' : 'Canal Suspendu'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Decorative summary footer panel */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span>Affichage de {processedTenants.length} sur {rawTenants.length} tenants</span>
        <span className="italic">NeoGTec Realtime Routing MultiSaaS Grid</span>
      </div>

    </div>
  );
};
