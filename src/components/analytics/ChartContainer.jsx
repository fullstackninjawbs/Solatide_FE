import React from 'react';

const ChartContainer = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
      )}
      <div className="flex-1 w-full relative min-h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;
