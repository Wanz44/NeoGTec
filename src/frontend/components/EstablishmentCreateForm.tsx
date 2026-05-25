/**
 * 📄 Fichier : /src/frontend/components/EstablishmentCreateForm.tsx
 * 🎯 Objectif : Formulaire de création d'un nouvel établissement (Hôpital/Clinique).
 */
import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Globe, ShieldCheck, Lock, Search, X, 
  Hospital, Mail, Phone, MapPin, Activity, Server
} from 'lucide-react';

interface EstablishmentCreateFormProps {
  onClose: () => void;
}

export const EstablishmentCreateForm: React.FC<EstablishmentCreateFormProps> = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Hôpital Général');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Simulate API registration and trigger feedback
    alert(`L'établissement "${name}" (${category}) à ${location || 'l\'adresse renseignée'} a été enregistré et certifié HL7.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-green-950/40 backdrop-blur-sm"
      />
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden border border-green-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-green-100 flex justify-between items-center bg-green-50/30">
          <div>
            <h3 className="text-xl font-black text-green-950 uppercase italic flex items-center gap-2">
              <Hospital className="w-6 h-6 text-green-600" /> Enregistrement Établissement
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Nouveau partenaire du réseau AssurAdvance</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-white rounded-md transition-all border border-transparent hover:border-green-200 shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* General Info */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Informations Générales
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Nom de l'Établissement</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Centre Hospitalier de Kinshasa" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all shadow-sm text-slate-800" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Catégorie</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all shadow-sm text-slate-800"
                >
                  <option>Hôpital Général</option>
                  <option>Clinique Spécialisée</option>
                  <option>Centre Médical</option>
                  <option>Laboratoire d'Analyses</option>
                  <option>Pharmacie Partenaire</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Email de Contact</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@hopital.org" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Téléphone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+243 ..." 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm text-slate-800" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Localisation / Ville</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Kinshasa, Gombe" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm text-slate-800" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure & Quotas */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <p className="text-green-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Server className="w-4 h-4" /> Configuration SaaS & Quotas
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Capacité Patients (Quota)</label>
                <input 
                   type="number" 
                   required
                   placeholder="ex: 10000" 
                   className="w-full px-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm text-slate-800" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">Régime de Facturation</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm text-slate-800">
                  <option>Standard (Commission 5%)</option>
                  <option>Premium (Commission 3%)</option>
                  <option>Forfait Mensuel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="p-4 bg-green-50 rounded-md border border-green-300 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-[10px] font-black text-green-950 uppercase">Accès API Sécurisé</p>
                <p className="text-[9px] font-medium text-green-600 italic">Génération automatique des clés d'accès HL7/FHIR</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-green-600 rounded-full relative shadow-inner">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            type="button"
            onClick={onClose} 
            className="flex-1 py-3 border border-slate-300 text-slate-400 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm cursor-pointer"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="flex-1 py-3 bg-green-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all border border-green-700 cursor-pointer"
          >
            Valider l'Établissement
          </button>
        </div>
      </motion.form>
    </div>
  );
};
