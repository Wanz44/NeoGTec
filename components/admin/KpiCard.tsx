/**
 * 🎨 Fichier : /components/admin/KpiCard.tsx
 * 📊 Composant : Carte de KPI analytique NeoGTec en mode Clair avec mini-graphe intégré.
 */

import React from 'react';
import { Card, Text, Metric, BadgeDelta, AreaChart } from '@/src/frontend/components/super-admin/TremorComponents';

export interface KpiCardProps {
  title: string;
  metric: string;
  delta: string;
  deltaType?: 'increase' | 'decrease' | 'moderateIncrease' | 'moderateDecrease' | 'unchanged';
  subtext: string;
  chartData?: any[];
  categories?: string[];
  colors?: string[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  metric,
  delta,
  deltaType = 'increase',
  subtext,
  chartData,
  categories = ['total'],
  colors = ['emerald']
}) => {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 relative overflow-hidden transition-all hover:border-[#00A86B]/30">
      <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">{title}</Text>
      
      <div className="flex items-baseline justify-between mt-1">
        <Metric className="text-slate-900 text-3xl font-black tracking-tight">{metric}</Metric>
        <BadgeDelta 
          deltaType={deltaType} 
          className={
            deltaType === 'increase' || deltaType === 'moderateIncrease'
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
              : "bg-red-50 text-red-700 border-red-200/50"
          }
        >
          {delta}
        </BadgeDelta>
      </div>

      <Text className="text-slate-450 text-[10px] font-medium mt-1 uppercase tracking-wider">{subtext}</Text>
      
      {chartData && chartData.length > 0 && (
        <AreaChart 
          data={chartData} 
          categories={categories} 
          colors={colors} 
          showYAxis={false} 
          className="h-16 mt-4" 
        />
      )}
    </Card>
  );
};
