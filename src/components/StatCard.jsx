import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatNumber, formatChange } from '../utils/formatters';

export default function StatCard({ label, value, change, suffix = '', icon: Icon, iconBg = 'ig-gradient', loading }) {
  const isPos = change > 0;
  const isNeg = change < 0;

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          {loading ? (
            <div className="h-7 w-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {typeof value === 'number' ? formatNumber(value) : value}{suffix}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPos ? 'text-green-600 dark:text-green-400' : isNeg ? 'text-red-500 dark:text-red-400' : 'text-gray-400'}`}>
          {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : isNeg ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          <span>{formatChange(change)} vs last period</span>
        </div>
      )}
    </div>
  );
}
