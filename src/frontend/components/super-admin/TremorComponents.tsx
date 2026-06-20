/**
 * 📄 Fichier : /src/frontend/components/super-admin/TremorComponents.tsx
 * 🎯 Objectif : Wrapper d'équivalence Tremor UI s'appuyant sur Recharts et Tailwind.
 * 🎨 Thème : 100% NeoGTec Clair (Zéro Bleu Générique, émeraude #00A86B, blanc cassé, anthracite).
 */

import React from 'react';
import { 
  ResponsiveContainer, AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line, CartesianGrid
} from 'recharts';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Card (Sleek light card with NeoGTec borders and hover effects)
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[#00A86B]/30 hover:shadow-md", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Text (Anthracite / slate soft text)
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const Text: React.FC<TextProps> = ({ className, children, ...props }) => {
  return (
    <p className={cn("text-xs text-slate-500 mt-0.5 leading-normal font-medium", className)} {...props}>
      {children}
    </p>
  );
};

// Metric (Bold, authoritative display font)
export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Metric: React.FC<MetricProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("text-2xl font-black font-sans text-slate-900 tracking-tight mt-1 flex items-baseline gap-1.5", className)} {...props}>
      {children}
    </div>
  );
};

// Title
export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  icon?: React.ComponentType<{ className?: string }>;
}
export const Title: React.FC<TitleProps> = ({ className, children, icon: Icon, ...props }) => {
  return (
    <h3 className={cn("text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic", className)} {...props}>
      {Icon && <Icon className="w-4 h-4 text-[#00A86B]" />}
      {children}
    </h3>
  );
};

// Subtitle
export interface SubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const Subtitle: React.FC<SubtitleProps> = ({ className, children, ...props }) => {
  return (
    <p className={cn("text-[10px] text-slate-400 font-bold uppercase tracking-wider", className)} {...props}>
      {children}
    </p>
  );
};

// Grid
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  numItemsLg?: number;
}
export const Grid: React.FC<GridProps> = ({ numItemsLg = 4, className, children, ...props }) => {
  const gridCols = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[numItemsLg] || 'lg:grid-cols-4';

  return (
    <div className={cn("grid grid-cols-1 gap-4", gridCols, className)} {...props}>
      {children}
    </div>
  );
};

// BadgeDelta (Themed with NeoGTec emerald & red light-mode badges)
export interface BadgeDeltaProps extends React.HTMLAttributes<HTMLSpanElement> {
  deltaType?: 'increase' | 'decrease' | 'moderateIncrease' | 'moderateDecrease' | 'unchanged';
}
export const BadgeDelta: React.FC<BadgeDeltaProps> = ({ deltaType = 'increase', className, children, ...props }) => {
  const isPositive = deltaType === 'increase' || deltaType === 'moderateIncrease';
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wide",
        isPositive 
          ? "text-[#00A86B] bg-[#00A86B]/10 border-[#00A86B]/15" 
          : "text-red-700 bg-red-50 border-red-200",
        className
      )}
      {...props}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{children}</span>
    </span>
  );
};

// Custom hex colors matching NeoGTec style (ZÉRO BLEU GÉNÉRIQUE)
// Replacing blues and indigos with teal and emerald
const COLOR_MAP: Record<string, string> = {
  emerald: '#00A86B', // NeoGTec emerald
  green: '#22C55E',   // Success green
  teal: '#14B8A6',    // Soft teal
  slate: '#64748B',   // Admin slate
  red: '#EF4444',     // Crimson alert
  orange: '#F97316',  // Warm accent
  blue: '#14B8A6',    // Overridden to Teal
  indigo: '#00A86B',  // Overridden to Emerald
  sky: '#14B8A6'      // Overridden to Teal
};

// Custom light-mode tooltips
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3.5 rounded-xl text-xs leading-normal font-sans shadow-xl text-slate-800">
        {label && <p className="font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>}
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const entryColor = entry.color || COLOR_MAP[entry.name] || '#00A86B';
            return (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entryColor }} />
                  <span className="font-bold text-slate-600">{entry.name}:</span>
                </div>
                <span className="font-black text-slate-900 font-mono">
                  {entry.value !== undefined ? (typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value) : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// AreaChart
export interface AreaChartProps {
  data: any[];
  categories: string[];
  colors: string[];
  index?: string;
  showYAxis?: boolean;
  showLegend?: boolean;
  className?: string;
}
export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  categories,
  colors,
  index = 'date',
  showYAxis = false,
  showLegend = false,
  className
}) => {
  return (
    <div className={cn("w-full h-32 mt-4", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            {categories.map((cat, idx) => {
              const colorHex = COLOR_MAP[colors[idx]] || colors[idx] || '#00A86B';
              return (
                <linearGradient key={cat} id={`grad-${cat}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorHex} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={colorHex} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <XAxis 
            dataKey={index} 
            stroke="#94A3B8" 
            fontSize={9} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          {showYAxis && (
            <YAxis 
              stroke="#94A3B8" 
              fontSize={9} 
              fontWeight={600}
              tickLine={false} 
              axisLine={false} 
              dx={-8}
            />
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
          {categories.map((cat, idx) => {
            const colorHex = COLOR_MAP[colors[idx]] || colors[idx] || '#00A86B';
            return (
              <Area
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={colorHex}
                fillOpacity={1}
                fill={`url(#grad-${cat})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: colorHex }}
              />
            );
          })}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// BarChart
export interface BarChartProps {
  data: any[];
  categories: string[];
  colors: string[];
  index?: string;
  stack?: boolean;
  className?: string;
}
export const BarChart: React.FC<BarChartProps> = ({
  data,
  categories,
  colors,
  index = 'date',
  stack = false,
  className
}) => {
  return (
    <div className={cn("w-full h-48 mt-4", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis 
            dataKey={index} 
            stroke="#94A3B8" 
            fontSize={9} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={9} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false} 
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', opacity: 0.6 }} />
          {categories.map((cat, idx) => {
            const colorHex = COLOR_MAP[colors[idx]] || colors[idx] || '#00A86B';
            return (
              <Bar 
                key={cat} 
                dataKey={cat} 
                stackId={stack ? "stack" : undefined}
                fill={colorHex} 
                radius={idx === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={45}
              />
            );
          })}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// DonutChart (With embedded count at the center, matching image)
export interface DonutChartProps {
  data: { name: string; value: number }[];
  category: string;
  index: string;
  colors: string[];
  className?: string;
  label?: string; // Explicit center display from screenshot
}
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  category,
  index,
  colors,
  className,
  label
}) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const displayLabel = label || total.toLocaleString();

  return (
    <div className={cn("w-full h-44 flex items-center justify-center relative", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={68}
            paddingAngle={2}
            dataKey={category}
            nameKey={index}
          >
            {data.map((entry, idx) => {
              const colorHex = COLOR_MAP[colors[idx]] || colors[idx] || '#00A86B';
              return <Cell key={`cell-${idx}`} fill={colorHex} />;
            })}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-black text-slate-800 tracking-tight font-sans">
          {displayLabel}
        </span>
        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">Total</span>
      </div>
    </div>
  );
};

// LineChart
export interface LineChartProps {
  data: any[];
  categories: string[];
  colors: string[];
  index?: string;
  className?: string;
}
export const LineChart: React.FC<LineChartProps> = ({
  data,
  categories,
  colors,
  index = 'date',
  className
}) => {
  return (
    <div className={cn("w-full h-48 mt-4", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} strokeDasharray="3 3" />
          <XAxis 
            dataKey={index} 
            stroke="#94A3B8" 
            fontSize={9} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            stroke="#94A3B8" 
            fontSize={9} 
            fontWeight={600}
            tickLine={false} 
            axisLine={false} 
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} />
          {categories.map((cat, idx) => {
            const colorHex = COLOR_MAP[colors[idx]] || colors[idx] || '#00A86B';
            return (
              <Line 
                key={cat} 
                type="monotone"
                dataKey={cat} 
                stroke={colorHex} 
                strokeWidth={2}
                dot={{ r: 3, fill: colorHex }}
                activeDot={{ r: 5 }}
              />
            );
          })}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// BarList (From screenshot list elements visualizer)
export interface BarListData {
  name: string;
  value: number;
}
export interface BarListProps {
  data: BarListData[];
  color?: string;
  className?: string;
}
export const BarList: React.FC<BarListProps> = ({ data, color = 'emerald', className }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barColor = COLOR_MAP[color] || '#00A86B';

  return (
    <div className={cn("space-y-3 mt-4", className)}>
      {data.map((item, idx) => {
        const percentage = (item.value / maxVal) * 100;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="truncate">{item.name}</span>
              <span className="font-mono">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
