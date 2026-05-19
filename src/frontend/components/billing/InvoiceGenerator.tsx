import React from 'react';
import { FileText, Download, Printer, Share2, ShieldCheck, QrCode } from 'lucide-react';

export const InvoiceGenerator: React.FC = () => {
  const invoiceData = {
    number: 'FAC-2024-8842',
    date: '19 Mai 2026',
    patient: 'Adonaï WANZAMBI',
    provider: 'Hôpital Général Référence',
    acts: [
      { name: 'Consultation Générale', code: 'C1', cost: 40 },
      { name: 'Paludisme (Test Rapide)', code: 'L5', cost: 15 },
      { name: 'Traitement Ambulatoire', code: 'P4', cost: 25 },
    ],
    total: 80,
    coverage: 64, // 80%
    remains: 16,
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden group">
      {/* Header Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-green-600" />
          <span className="text-xs font-black text-green-950 uppercase tracking-widest">Facture Normalisée</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-green-600">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-green-600">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-green-600">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invoice Content (Look like a paper) */}
      <div className="p-8 space-y-8 min-h-[500px] relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-700" />

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-green-950 italic tracking-tighter">AFREAKCARE.</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Standard Billing Format</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">{invoiceData.number}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{invoiceData.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[11px] border-y border-slate-100 py-6">
          <div>
            <p className="font-black text-slate-400 uppercase tracking-widest mb-2">Établissement</p>
            <p className="font-black text-green-950 uppercase">{invoiceData.provider}</p>
            <p className="text-slate-500 italic">ID Convention: CONV-77412</p>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-400 uppercase tracking-widest mb-2">Bénéficiaire</p>
            <p className="font-black text-green-950 uppercase">{invoiceData.patient}</p>
            <p className="text-slate-500 italic">Assuré Principal</p>
          </div>
        </div>

        <div className="space-y-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 italic">
                <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actes médicaux</th>
                <th className="pb-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Tarifié ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoiceData.acts.map((act, i) => (
                <tr key={i}>
                  <td className="py-4">
                    <span className="block text-xs font-black text-slate-700">{act.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase italic">Code: {act.code}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-black text-slate-900">{act.cost.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-8 space-y-3">
          <div className="flex justify-between items-end border-t border-slate-100 pt-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Conventionné</span>
             <span className="text-lg font-black text-slate-900">{invoiceData.total.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Prise en charge (80%)</span>
             <span className="text-sm font-black text-emerald-600">-{invoiceData.coverage.toFixed(2)} $</span>
          </div>
          <div className="flex justify-between items-end p-4 bg-green-950 text-white rounded-2xl shadow-xl shadow-green-950/20">
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Reste à régler</span>
               <span className="text-[8px] font-medium text-white/40 italic">Incluant Franchise + Ticket Modérateur</span>
             </div>
             <span className="text-2xl font-black">{invoiceData.remains.toFixed(2)} $</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-8 border-t border-dashed border-slate-200">
          <div className="flex items-center gap-3">
            <QrCode className="w-12 h-12 text-slate-200" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-300 uppercase leading-none">Digital Validation Signature</span>
              <span className="text-[7px] font-mono text-slate-200 truncate w-32">0x8842-AFK-SECURE-INV-GNR-2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className="w-6 h-6 text-green-600/20" />
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-right">Conforme aux<br/>Barèmes INAMI/RDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
