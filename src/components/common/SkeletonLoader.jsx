import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const CardSkeleton = () => (
    <div className="glass rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-white/10 rounded w-2/3"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-white/10 rounded w-20"></div>
        <div className="h-8 bg-white/10 rounded w-20"></div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="glass rounded-xl overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-white/10 animate-pulse">
          <div className="h-4 bg-white/10 rounded flex-1"></div>
          <div className="h-4 bg-white/10 rounded flex-1"></div>
          <div className="h-4 bg-white/10 rounded flex-1"></div>
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const skeletons = {
    card: CardSkeleton,
    table: TableSkeleton,
    list: ListSkeleton,
  };

  const SkeletonComponent = skeletons[type] || CardSkeleton;

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;