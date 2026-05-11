import React from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export const Pricing: React.FC = () => {
  const plans = [
    { name: 'Initial Santé', users: '1-100', price: '0$', color: 'bg-emerald-500' },
    { name: 'SaaS Premium', users: '100-500', price: '0$', color: 'bg-orange-500' },
    { name: 'Enterprise Pro', users: '500+', price: 'N/A', color: 'bg-blue-600' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Tarification</h2>
        <p className="text-slate-500 font-medium text-sm">Gestion des moteurs de calcul et des grilles de cotisations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="fluent-card p-6 flex flex-col h-full"
          >
            <div className={cn("inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-4 w-fit", plan.color)}>
              {plan.name}
            </div>
            <div className="mb-6">
              <span className="text-4xl font-black text-orange-950 tracking-tighter">{plan.price}</span>
              {plan.price !== 'Sur devis' && <span className="text-slate-400 text-sm ml-1 font-medium">/mois/adhérent</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Calcul actuariel temps réel', 'Support 24/7', 'Intégration API illimitée', 'Reporting avancé'].map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className="w-full py-2.5 bg-orange-500 text-white rounded-[8px] font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95">
              Configurer l'algorithme
            </button>
          </motion.div>
        ))}
      </div>

      <div className="material-mica p-8 rounded-fluent border border-orange-100/30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-orange-100 rounded-[12px] flex items-center justify-center shrink-0">
            <Calculator className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-orange-950 mb-2">Simulateur de Prime Dynamique</h3>
            <p className="text-slate-600 text-sm font-medium mb-4 max-w-xl">
              Ajustez les variables de risque et les coefficients de pondération pour prévisualiser l'impact sur le CA global.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Âge moyen', 'Zone géographique', 'Antécédents', 'Plafond garantie'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/50 border border-black/5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button className="px-8 py-3 bg-white border border-black/5 rounded-[10px] font-bold text-orange-950 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Lancer Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
