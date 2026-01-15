
import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm p-8 animate-pulse">
      <div className="h-56 bg-slate-200 rounded-2xl mb-6"></div>
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded w-full"></div>
        <div className="h-6 bg-slate-200 rounded w-5/6"></div>
        <div className="pt-8 mt-8 border-t border-gray-100">
          <div className="h-10 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, i) => (
            <SkeletonLoader key={i} />
        ))}
    </div>
);
