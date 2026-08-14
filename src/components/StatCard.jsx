import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber, formatChange } from '../utils/formatters';

export default function StatCard({ label, value, change, suffix = '', icon: Icon, iconBg = 'ig-gradient', loading }) {
  const isPos = change > 0;
  const isNeg = change < 0;

  return (
    <div className="card card-hover p-5 flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          {loading ? (
            <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse mt-2" />
          ) : (
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
              {typeof value === 'number' ? formatNumber(value) : value}{suffix}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1.5 text-xs font-medium mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <span className={`inline-flex items-center gap-1 font-semibold ${isPos ? 'text-emerald-600 dark:text-emerald-400' : isNeg ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400'}`}>
            {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : isNeg ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {formatChange(change)}
          </span>
          <span className="text-slate-400 dark:text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  );
}
