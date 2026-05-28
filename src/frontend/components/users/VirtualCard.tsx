import React, { useState } from 'react';
import { Smartphone, QrCode, ShieldCheck, User, Users, Globe, Download, Share2, Info, Copy, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

export const VirtualCard: React.FC = () => {
  const { currentUser } = useApp();
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const policyCode = `POL-677-${currentUser.name.substring(0, 3).toUpperCase()}-CD`;

  const triggerDownload = (format: 'PDF' | 'JPEG') => {
    setDownloadingFormat(format);
    
    // Simulate generation and download
    setTimeout(() => {
      const element = document.createElement("a");
      const fileContent = `--- CARTE VIRTUELLE D'ASSURÉ AFREAKCARE ---\n\n` +
        `Titulaire: ${currentUser.name}\n` +
        `E-mail: ${currentUser.email}\n` +
        `Code de Police: ${policyCode}\n` +
        `Réseau d'admission: Tier-1 Premium+ EAC\n` +
        `Formule souscrite: ${currentUser.contractName}\n` +
        `Statut d'assurance: ACTIF & VÉRIFIÉ\n` +
        `Date d'émission: 2026-05-28\n` +
        `Date d'expiration: 12 / 2028\n\n` +
        `© Ministère de la Santé - Régulation ARCA RDC`;
      
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `AfreakCare_Virtual_Card_${currentUser.name.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadingFormat(null);
    }, 1500);
  };

  const handleCopyLink = () => {
    const cardUrl = `https://portal.afreakcare.cd/verify-card/${policyCode}`;
    navigator.clipboard.writeText(cardUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareNative = async () => {
    const shareData = {
      title: 'Ma Carte Virtuelle AfreakCare',
      text: `Voici ma carte digitale d'assuré AfreakCare RDC. Police: ${policyCode}`,
      url: `https://portal.afreakcare.cd/verify-card/${policyCode}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        setShareDrawerOpen(true);
      }
    } else {
      setShareDrawerOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-350">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-green-955 italic uppercase tracking-tighter">Votre Carte Digitale</h2>
        <p className="text-xs font-bold text-slate-400 p-0.5 tracking-widest italic leading-none">Identification Universelle AfreakCare</p>
      </div>

      {/* The Card */}
      <div className="relative aspect-[1.58/1] w-full bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/40 overflow-hidden group border border-slate-800">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/15 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-950/20 to-transparent" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="space-y-1">
                <h1 className="text-2xl font-black italic tracking-tighter text-green-400">AFREAKCARE.</h1>
                <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/25 rounded text-[7px] font-black uppercase tracking-[0.2em] w-fit">
                   Standard International
                </div>
             </div>
             <div className="flex flex-col items-end">
                <Globe className="w-5 h-5 text-white/30" />
                <span className="text-[8px] font-bold text-white/40 uppercase mt-1">Global Pass / Zone EAC</span>
             </div>
          </div>

          <div className="space-y-4">
             <div>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Titulaire du compte</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                      {currentUser?.photo ? (
                        <img src={currentUser.photo} className="w-full h-full object-cover" alt="Avatar assured" />
                      ) : (
                        <User className="w-6 h-6 text-white/30" />
                      )}
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase tracking-tight text-white">{currentUser?.name}</p>
                      <p className="text-[9.5px] font-bold text-green-400 font-mono italic">{policyCode}</p>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end border-t border-white/5 pt-4">
                <div className="flex gap-6">
                   <div>
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Expire le</p>
                      <p className="text-[10px] font-black">12 / 2028</p>
                   </div>
                   <div>
                      <p className="text-[7px] font-black text-white/30 uppercase tracking-widest">Réseau</p>
                      <p className="text-[10px] font-black uppercase text-green-400">Premium +</p>
                   </div>
                </div>
                <div className="p-1.5 bg-white rounded-lg shadow-inner">
                   <QrCode className="w-8 h-8 text-slate-950" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {downloadingFormat && (
        <div className="p-3 bg-green-500/10 border border-green-500/10 rounded-xl text-center flex items-center justify-center gap-2">
           <span className="w-2 h-2 rounded-full bg-green-600 animate-ping" />
           <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Génération du fichier {downloadingFormat} de l'assuré en cours...</span>
        </div>
      )}

      {/* Grid of Actions */}
      <div className="grid grid-cols-3 gap-3">
         <button 
           onClick={() => triggerDownload('PDF')}
           disabled={!!downloadingFormat}
           className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 active:scale-95 transition-all shadow-xs group cursor-pointer disabled:opacity-50"
         >
            <div className="p-2.5 bg-slate-950 text-white rounded-xl group-hover:scale-105 transition-transform">
               <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-800 text-center leading-none">Télécharger PDF</span>
         </button>

         <button 
           onClick={() => triggerDownload('JPEG')}
           disabled={!!downloadingFormat}
           className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 active:scale-95 transition-all shadow-xs group cursor-pointer disabled:opacity-50"
         >
            <div className="p-2.5 bg-green-600 text-white rounded-xl group-hover:scale-105 transition-transform">
               <Download className="w-4 h-4 text-white" />
            </div>
            <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-800 text-center leading-none">Télécharger JPEG</span>
         </button>

         <button 
           onClick={handleShareNative}
           className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-100 rounded-3xl hover:bg-slate-50 active:scale-95 transition-all shadow-xs group cursor-pointer"
         >
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
               <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-800 text-center leading-none">Partager la carte</span>
         </button>
      </div>

      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
         <Info className="w-5 h-5 text-amber-500 shrink-0" />
         <p className="text-[10px] font-bold text-amber-900/60 leading-relaxed italic">
           Présentez ce QR Code dans n'importe quel hôpital ou pharmacie certifiée ARCA en RDC pour une prise en charge automatique. Les ayants droit peuvent l'obtenir par partage direct.
         </p>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
         <ShieldCheck className="w-4 h-4 text-emerald-500" />
         <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Validé par l'autorité de régulation des assurances ARCA RDC</span>
      </div>

      {/* Share Modals Fallback */}
      {shareDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-[500] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
             <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-black uppercase text-slate-800">Partager via une méthode</span>
                <button 
                  onClick={() => setShareDrawerOpen(false)}
                  className="font-mono text-lg font-bold text-slate-400 hover:text-slate-950 p-1 cursor-pointer outline-none"
                >
                  ×
                </button>
             </div>
             
             <div className="space-y-2">
                <button 
                  onClick={handleCopyLink}
                  className="w-full h-11 px-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center justify-between border transition-all cursor-pointer"
                >
                   <span className="flex items-center gap-2 text-slate-800">
                     <Copy className="w-4 h-4 text-slate-400" />
                     {copiedLink ? "Lien Copié !" : "Copier le Lien Web"}
                   </span>
                   {copiedLink && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>

                <a 
                  href={`mailto:?subject=AfreakCare%20Virtual%20Card&body=Voici%20ma%20carte%20digitale%20d'assuré%20AfreakCare.%20Police%20Code:%20${policyCode}`}
                  className="w-full h-11 px-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 border transition-all justify-start"
                >
                   <Mail className="w-4 h-4 text-slate-400" />
                   <span className="text-slate-800">Partager par E-mail</span>
                </a>

                <a 
                  href={`https://api.whatsapp.com/send?text=Voici%20ma%20carte%20digitale%20d'assuré%20AfreakCare%20RDC.%20Police%20:${policyCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-11 px-4 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl flex items-center gap-2 border transition-all justify-start"
                >
                   <Smartphone className="w-4 h-4 text-green-500" />
                   <span className="text-slate-800">Partager par WhatsApp</span>
                </a>
             </div>

             <button 
               onClick={() => setShareDrawerOpen(false)}
               className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer mt-2"
             >
                Fermer
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
