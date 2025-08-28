
import React from 'react';

const SkeletonPostCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto overflow-hidden relative shadow-md">
      <div className="animate-pulse flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
      {/* Shimmer effect */}
      <div className="absolute top-0 left-0 w-full h-full">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-100/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
};

export default SkeletonPostCard;
