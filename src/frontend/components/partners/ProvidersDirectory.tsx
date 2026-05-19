/**
 * 📄 Fichier : /src/frontend/components/partners/ProvidersDirectory.tsx
 * 🎯 Objectif : Référentiel des prestataires hospitaliers avec géolocalisation.
 */
import React, { useState } from 'react';
import { 
  Search, MapPin, Phone, Globe, Star, ShieldCheck, 
  Filter, Plus, Building2, Navigation, Clock, Info
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export interface Provider {
  id: string;
  name: string;
  type: 'Hôpital' | 'Clinique' | 'Centre de Santé' | 'Pharmacie';
  address: string;
  district: string;
  rating: number;
  status: 'Conventionné' | 'En attente' | 'Suspendu';
  facilities: string[];
  contact: string;
  coordinates: { lat: number; lng: number };
}

const MOCK_PROVIDERS: Provider[] = [
  {
    id: 'P1',
    name: 'Hôpital HJ Hospitals',
    type: 'Hôpital',
    address: '2337 Blvd du 30 Juin',
    district: 'Gombe',
    rating: 4.8,
    status: 'Conventionné',
    facilities: ['Urgences 24/7', 'IRM', 'Chirurgie Spécialisée'],
    contact: '+243 811 123 456',
    coordinates: { lat: -4.3033, lng: 15.3142 }
  },
  {
    id: 'P2',
    name: 'Clinique Ngaliema',
    type: 'Clinique',
    address: 'Av. de la Clinique',
    district: 'Gombe',
    rating: 4.5,
    status: 'Conventionné',
    facilities: ['Maternité', 'Pédiatrie', 'Laboratoire'],
    contact: '+243 899 987 654',
    coordinates: { lat: -4.3121, lng: 15.2987 }
  },
  {
    id: 'P3',
    name: 'Centre de Santé Roi Baudouin',
    type: 'Centre de Santé',
    address: 'Av. de l\'Hôpital',
    district: 'Masina',
    rating: 3.9,
    status: 'Suspendu',
    facilities: ['Soins Primaires', 'Vaccination'],
    contact: '+243 822 222 222',
    coordinates: { lat: -4.3876, lng: 15.3982 }
  }
];

export const ProvidersDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredProviders = MOCK_PROVIDERS.filter(p => 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.district.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterType === 'All' || p.type === filterType)
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, quartier..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Hôpital', 'Clinique', 'Centre de Santé', 'Pharmacie'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                filterType === type ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
              {type === 'All' ? 'Tous' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List View */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={provider.id} 
              className="group p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 italic tracking-tight">{provider.name}</h3>
                    <div className="flex items-center gap-2">
                       <MapPin className="w-3 h-3 text-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{provider.district}, Kinshasa</span>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em]",
                  provider.status === 'Conventionné' ? "bg-emerald-50 text-emerald-600" : 
                  provider.status === 'Suspendu' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                )}>
                  {provider.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Note</p>
                   <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-slate-900">{provider.rating}</span>
                   </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Capacité</p>
                   <p className="text-xs font-black text-slate-900 italic">Plateau A++</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-center">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Distance</p>
                   <p className="text-xs font-black text-slate-900 italic">2.4 km</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {provider.facilities.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[9px] font-bold text-indigo-600 uppercase tracking-tight">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <Phone className="w-4 h-4" />
                   </button>
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <Navigation className="w-4 h-4" />
                   </button>
                </div>
                <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                  Voir Profil Complet
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Placeholder View */}
        <div className="h-[600px] bg-slate-100 rounded-[32px] border border-slate-200 overflow-hidden relative group">
           <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/15.3142,-4.3033,12,0/800x800?access_token=pk.placeholder')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" />
           <div className="absolute inset-0 bg-indigo-950/5 pointer-events-none" />
           
           {/* Custom Markers on Map */}
           {filteredProviders.map(p => (
             <div 
               key={p.id}
               className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer"
               style={{ 
                 top: `${Math.random() * 60 + 20}%`, 
                 left: `${Math.random() * 60 + 20}%` 
               }}
             >
                <div className="w-full h-full bg-white rounded-full p-1.5 shadow-xl border-2 border-indigo-600 group">
                   <Building2 className="w-full h-full text-indigo-600" />
                </div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                   {p.name}
                </div>
             </div>
           ))}

           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Navigation className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">Ma position</p>
                    <p className="text-[8px] font-bold text-slate-400">Kinshasa, Gombe - Blvd 30 Juin</p>
                 </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest">Calculer Itinéraire</button>
           </div>
        </div>
      </div>
    </div>
  );
};
