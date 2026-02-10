export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-xl h-48 mb-3"></div>
    <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="animate-pulse flex gap-4">
        <div className="bg-gray-200 rounded-lg w-24 h-24 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-1/2 mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="bg-gray-200 h-10 rounded"></div>
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="bg-gray-100 h-16 rounded"></div>
    ))}
  </div>
);
