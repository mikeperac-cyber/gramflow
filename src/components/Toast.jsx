import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />,
  error:   <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />,
  info:    <Info        className="w-4 h-4 text-blue-500 shrink-0" />,
};

const colors = {
  success: 'border-green-200 dark:border-green-800',
  error:   'border-red-200 dark:border-red-800',
  info:    'border-blue-200 dark:border-blue-800',
};

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            animate-slide-in pointer-events-auto
            flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
            bg-white dark:bg-gray-900 border ${colors[t.type] || colors.info}
            max-w-sm min-w-[260px]
          `}
        >
          {icons[t.type] || icons.info}
          <span className="text-sm text-gray-800 dark:text-gray-100 flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
