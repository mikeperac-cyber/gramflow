import React from 'react';

export default function PageLoader() {
  return (
    <div className="space-y-6 animate-pulse py-4">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl lg:col-span-2" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    </div>
  );
}
