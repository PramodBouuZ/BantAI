import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm p-6 flex flex-col h-full animate-pulse">
    <div className="h-48 bg-slate-200 rounded-2xl mb-4" />
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-slate-200 rounded w-full mb-4" />
    <div className="mt-auto">
      <div className="h-10 bg-slate-200 rounded-xl w-full" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="px-6 py-2.5 rounded-full bg-slate-200 w-24 h-10 animate-pulse" />
);
