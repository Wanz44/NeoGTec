import React from 'react';
import { History, Calendar, MapPin, Activity, Stethoscope, Pill, FlaskConical, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConsumptionRecord {
  id: string;
  date: string;
  type: 'consultation' | 'pharmacy' | 'lab';
  provider: string;
  description: string;
  amount: number;
  status: 'Validated' | 'Pending' | 'Rejected';
}

const HISTORY_DATA: ConsumptionRecord[] = [
  { id: '1', date: '15 Mai 2026', type: 'consultation', provider: 'Clinique ProSanté', description: 'Consultation ORL + Actes divers', amount: 45, status: 'Validated' },
  { id: '2', date: '12 Mai 2026', type: 'pharmacy', provider: 'Pharmacie Centrale', description: 'Ordonnance Antibiotiques', amount: 32, status: 'Validated' },
  { id: '3', date: '05 Mai 2026', type: 'lab', provider: 'Labo Bio-X', description: 'Bilan Sanguin Complet', amount: 85, status: 'Validated' },
  { id: '4', date: '28 Avril 2026', type: 'consultation', provider: 'Hôpital Général', description: 'Urgences - Traumatisme léger', amount: 120, status: 'Validated' },
];

export const ConsumptionHistory: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="w-4 h-4" />;
      case 'pharmacy': return <Pill className="w-4 h-4" />;
      case 'lab': return <FlaskConical className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated': return 'text-emerald-500 bg-emerald-50';
      case 'Pending': return 'text-amber-500 bg-amber-50';
      case 'Rejected': return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-950 rounded-2xl">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">Historique Assuré</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Journal complet des actes</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest border border-slate-200">
             Filtrer
           </button>
           <button className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase transition-all tracking-widest shadow-lg shadow-slate-950/20">
             Export PDF
           </button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100 -z-10" />

        <div className="space-y-6">
          {HISTORY_DATA.map((item, idx) => (
            <div key={item.id} className="group relative pl-16">
              {/* Timeline Dot with Icon */}
              <div className={cn(
                "absolute left-0 top-1 p-3 rounded-2xl border-2 border-white transition-all transform group-hover:scale-110 shadow-sm",
                item.type === 'consultation' ? "bg-blue-50 text-blue-600" : 
                item.type === 'pharmacy' ? "bg-purple-50 text-purple-600" : "bg-teal-50 text-teal-600"
              )}>
                {getIcon(item.type)}
              </div>

              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.date}</span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest",
                    getStatusColor(item.status)
                  )}>
                    {item.status}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 group-hover:text-slate-950 transition-colors">{item.description}</p>
                    <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] font-bold italic">{item.provider}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 pl-4">
                    <span className="text-lg font-black text-slate-900">{item.amount.toFixed(2)} $</span>
                    <button className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                      Détails <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
