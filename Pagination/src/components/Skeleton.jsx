import React from "react";

const Skeleton = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-6 flex flex-col items-start animate-pulse border border-gray-100">
      {/* Title Placeholder */}
      <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"></div>
      
      {/* Description Placeholder */}
      <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-3"></div>
      <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-3"></div>
      <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
      
      {/* Additional visual elements */}
      <div className="mt-4 flex gap-2">
        <div className="h-3 w-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full"></div>
        <div className="h-3 w-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default Skeleton;