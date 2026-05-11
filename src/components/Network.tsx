import React from 'react';
import { motion } from 'motion/react';
import { Network as NetworkIcon, MapPin, Phone, Star, Building2, Search } from 'lucide-react';

export const Network: React.FC = () => {
  const providers = [
    { name: 'Clinique de l\'Espoir', type: 'Hôpital', location: 'Paris', rating: 4.8, status: 'Premium' },
    { name: 'Centre Ophtalmo Pro', type: 'Spécialiste', location: 'Lyon', rating: 4.5, status: 'Conventionné' },
    { name: 'Pharmacie Centrale', type: 'Pharmacie', location: 'Marseille', rating: 4.9, status: 'Standard' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Réseau de Soins</h2>
        <p className="text-slate-500 font-medium text-sm">Gestion des prestataires de santé et maillage territorial.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="material-acrylic p-4 rounded-[12px] border border-white/40 flex items-center gap-3">
             <Search className="w-4 h-4 text-slate-400" />
             <input placeholder="Rechercher une clinique, un médecin ou une pharmacie..." className="bg-transparent border-none outline-none text-sm font-medium text-orange-950 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider, idx) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="fluent-card p-5 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 rounded-[10px] text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">
                    {provider.status}
                  </span>
                </div>
                <h3 className="text-[14px] font-bold text-orange-950 mb-1 leading-tight">{provider.name}</h3>
                <p className="text-[11px] font-bold text-orange-600 mb-4">{provider.type}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">{provider.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[11px] font-bold">{provider.rating}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-black/[0.03] flex items-center justify-between">
                   <button className="text-[11px] font-bold text-orange-600 hover:underline">Voir Profil</button>
                   <button className="p-2 rounded-full hover:bg-orange-50 transition-colors text-orange-500">
                     <Phone className="w-3.5 h-3.5" />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="material-mica p-6 rounded-fluent h-96 relative overflow-hidden flex flex-col justify-end">
             <div className="absolute inset-0 bg-slate-200">
                {/* Simulation de carte Map */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="relative">
                      <div className="w-8 h-8 bg-orange-500/20 animate-ping rounded-full absolute -top-4 -left-4" />
                      <MapPin className="w-8 h-8 text-orange-600 relative z-10" />
                   </div>
                </div>
             </div>
             <div className="relative z-10 material-acrylic p-4 rounded-[12px] border border-white/60">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Couverture Locale</p>
                <h4 className="text-sm font-bold text-orange-950">Zone Île-de-France</h4>
                <p className="text-[11px] text-slate-500 font-medium">1,240 prestataires actifs</p>
             </div>
          </div>

          <div className="fluent-card p-6">
             <h3 className="text-sm font-bold text-orange-950 mb-4 uppercase tracking-[0.15em]">Statistiques Réseau</h3>
             <div className="space-y-4">
                {[
                  { label: 'Maillage Territorial', value: '94%' },
                  { label: 'Temps d\'Attente Moyen', value: '4.2j' },
                  { label: 'Taux de Satisfaction', value: '4.9/5' }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center border-b border-black/[0.03] pb-2 last:border-0 last:pb-0">
                     <span className="text-[11px] font-medium text-slate-500">{stat.label}</span>
                     <span className="text-[11px] font-bold text-orange-950">{stat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
