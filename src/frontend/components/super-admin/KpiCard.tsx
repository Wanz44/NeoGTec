import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  change: string | number;
  alert?: boolean;
  channelKey?: string; // Optional key for differing triggers
  valuePrefix?: string;
  valueSuffix?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value: initialValue,
  change: initialChange,
  alert = false,
  channelKey = 'mrr_value',
  valuePrefix = '',
  valueSuffix = ''
}) => {
  const [currentValue, setCurrentValue] = useState<number | string>(initialValue);
  const [currentChange, setCurrentChange] = useState<number | string>(initialChange);
  const [isFlashing, setIsFlashing] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);

  // Parse initial numeric string helper
  const parseNumeric = (val: string | number): number => {
    if (typeof val === 'number') return val;
    const numericStr = val.replace(/[^0-9.-]/g, '');
    const num = parseFloat(numericStr);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    // 🔔 Establish realtime listening to supabase channel 'mrr'
    const channel = supabase.channel('mrr', {
      config: {
        broadcast: { self: true },
      },
    });

    // Handle broadcast trigger
    channel.on('broadcast', { event: 'mrr_live_tick' }, (payload: any) => {
      if (payload && payload.data) {
        setIsFlashing(true);
        setRealtimeActive(true);
        
        // Randomly mutate stats slightly around the base if channel triggered a tick
        if (title.toLowerCase().includes('mrr') || title.toLowerCase().includes('recurring')) {
          const delta = (Math.random() - 0.4) * 1250;
          const current = parseNumeric(String(currentValue));
          const updated = current + delta;
          setCurrentValue(updated.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
          
          // Re-evaluate change
          const newChange = parseFloat(String(currentChange)) + (delta > 0 ? 0.05 : -0.05);
          setCurrentChange(newChange.toFixed(2));
        } else if (title.toLowerCase().includes('loss') || title.toLowerCase().includes('sinis')) {
          const delta = (Math.random() - 0.5) * 0.2;
          const updated = Math.max(0, parseFloat(String(currentValue)) + delta);
          setCurrentValue(updated.toFixed(2));
        } else if (title.toLowerCase().includes('ticket') || title.toLowerCase().includes('alert')) {
          // Trigger slight alert count fluctuations
          const drift = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const updated = Math.max(0, Math.floor(parseNumeric(String(currentValue)) + drift));
          setCurrentValue(updated);
        }
        
        setTimeout(() => setIsFlashing(false), 800);
      }
    });

    // Subscribe to channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        setRealtimeActive(true);
      }
    });

    // Also simulate occasional lightweight local fallback ticks in background for presentation
    const timer = setInterval(() => {
      // Trigger a local broadcast through the actual channel so the listener catches it!
      channel.send({
        type: 'broadcast',
        event: 'mrr_live_tick',
        payload: { tick: Date.now() }
      });
    }, 9000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, [currentValue, currentChange, title]);

  const numChange = parseFloat(String(currentChange));
  const isUp = numChange >= 0;

  return (
    <div className={cn(
      "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all duration-300",
      alert && "border-red-900/30 bg-red-950/10 hover:border-red-500/40",
      isFlashing && (alert ? "bg-red-900/30 scale-[1.01]" : "bg-indigo-950/40 border-indigo-500/40 scale-[1.01]")
    )}>
      {/* Realtime Active Glow Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          realtimeActive ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
        )} title={realtimeActive ? "Canal Supabase MRR connecté et écoute actif" : "Canal Supabase déconnecté"} />
        <span className="text-[7.5px] font-mono text-slate-500 tracking-wider">LIVE</span>
      </div>

      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 font-mono">{title}</p>
      
      <div className="flex items-baseline gap-1 mb-2">
        {valuePrefix && <span className="text-sm font-bold text-slate-500 mr-0.5">{valuePrefix}</span>}
        <span className="text-2xl font-black text-white tracking-tight tabular-nums">
          {currentValue}
        </span>
        {valueSuffix && <span className="text-sm font-bold text-slate-400 ml-0.5">{valueSuffix}</span>}
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-0.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg",
          isUp 
            ? "text-emerald-400 bg-emerald-500/10" 
            : "text-rose-400 bg-rose-500/10"
        )}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isUp ? '+' : ''}{currentChange}%</span>
        </div>
        
        {alert && (
          <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 uppercase bg-red-500/10 px-2 py-0.5 rounded-lg animate-pulse" id="alert-kpi-badge">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Critique</span>
          </div>
        )}
      </div>

      {/* Decorative pulse line representing active thread */}
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 transition-all duration-300",
        alert ? "bg-red-500 w-[40%]" : "bg-indigo-500 w-[60%]",
        isFlashing && "w-full bg-gradient-to-r from-red-500 via-indigo-500 to-emerald-500"
      )} />
    </div>
  );
};
