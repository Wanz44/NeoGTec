import React, { useEffect, useState } from 'react';
import { Activity, Radio, Cpu, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RealtimePulse: React.FC = () => {
  // Array of historic numbers representing the sparklines
  const [trafficData, setTrafficData] = useState<number[]>([42, 45, 40, 50, 48, 55, 62, 58, 65, 70, 68, 74, 80, 85, 78, 82]);
  const [claimsData, setClaimsData] = useState<number[]>([12, 18, 14, 15, 22, 28, 25, 30, 28, 35, 41, 38, 45, 42, 50, 48]);
  const [latencyData, setLatencyData] = useState<number[]>([120, 115, 130, 125, 140, 160, 150, 145, 180, 190, 175, 210, 195, 230, 210, 180]);

  useEffect(() => {
    // 🟠 Dynamic pulse interval that shifts sparkline data points in real-time
    const runPulse = setInterval(() => {
      // 1. Traffic simulation drift (add new point, kick out first element)
      setTrafficData(prev => {
        const nextVal = Math.max(20, Math.min(100, prev[prev.length - 1] + (Math.random() - 0.45) * 15));
        return [...prev.slice(1), Math.round(nextVal)];
      });

      // 2. Claims processing speed drift
      setClaimsData(prev => {
        const nextVal = Math.max(5, Math.min(60, prev[prev.length - 1] + (Math.random() - 0.48) * 8));
        return [...prev.slice(1), Math.round(nextVal)];
      });

      // 3. API Latency drift
      setLatencyData(prev => {
        const nextVal = Math.max(80, Math.min(300, prev[prev.length - 1] + (Math.random() - 0.5) * 40));
        return [...prev.slice(1), Math.round(nextVal)];
      });
    }, 1500);

    return () => clearInterval(runPulse);
  }, []);

  // Visual helper to convert values into an SVG stroke path
  const makeSvgPath = (points: number[], height: number, maxVal: number) => {
    const width = 160;
    const step = width / (points.length - 1);
    
    const svgCoords = points.map((p, index) => {
      const x = index * step;
      // Invert Y direction since 0 is top of SVG box
      const scale = p / maxVal;
      const y = height - (scale * (height - 8));
      return `${x},${y}`;
    });

    return `M ${svgCoords.join(' L ')}`;
  };

  const trafficPath = makeSvgPath(trafficData, 42, 110);
  const claimsPath = makeSvgPath(claimsData, 42, 70);
  const latencyPath = makeSvgPath(latencyData, 42, 350);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full justify-between">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Flux Métriques et Télémétrie Live
          </h4>
          <span className="text-[9px] font-mono text-slate-500 block">
            Oscilloscope de monitoring réseau NeoGTec
          </span>
        </div>
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
      </div>

      {/* Sparkline cards row */}
      <div className="space-y-4">
        
        {/* SPARK 1: Traffic */}
        <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl flex items-center justify-between gap-4 group hover:border-slate-805 transition-colors">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Trafic Global</span>
            <p className="text-xl font-black text-white font-mono">{trafficData[trafficData.length - 1]} <span className="text-[10px] text-slate-400 font-bold">req/s</span></p>
          </div>
          
          {/* Animated SVG Sparkline rendering */}
          <div className="relative w-40 h-10 shrink-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 160 42">
              <path 
                d={trafficPath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              {/* Pulse circle on latest point */}
              <circle cx="160" cy={42 - (trafficData[trafficData.length - 1] / 110) * 34} r="3" fill="#10b981" />
            </svg>
          </div>
        </div>

        {/* SPARK 2: Claims velocity */}
        <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl flex items-center justify-between gap-4 group hover:border-slate-805 transition-colors">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Vélocité de Liquidation</span>
            <p className="text-xl font-black text-white font-mono">{claimsData[claimsData.length - 1]} <span className="text-[10px] text-slate-400 font-bold">claims/m</span></p>
          </div>

          <div className="relative w-40 h-10 shrink-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 160 42">
              <path 
                d={claimsPath} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              <circle cx="160" cy={42 - (claimsData[claimsData.length - 1] / 70) * 34} r="3" fill="#6366f1" />
            </svg>
          </div>
        </div>

        {/* SPARK 3: Gateway Delay */}
        <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl flex items-center justify-between gap-4 group hover:border-slate-805 transition-colors">
          <div className="space-y-1">
            <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wider">Latence API Gateway</span>
            <p className="text-xl font-black text-white font-mono">{latencyData[latencyData.length - 1]} <span className="text-[10px] text-slate-400 font-bold">ms</span></p>
          </div>

          <div className="relative w-40 h-10 shrink-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 160 42">
              <path 
                d={latencyPath} 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              <circle cx="160" cy={42 - (latencyData[latencyData.length - 1] / 350) * 34} r="3" fill="#f43f5e" />
            </svg>
          </div>
        </div>

      </div>

      <p className="text-[8px] text-slate-500 font-mono text-right mt-3">
        Synchronisé avec le heartbeat du cluster principal
      </p>

    </div>
  );
};
