import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Pagination Component
 * 
 * Props:
 * @param {number} page - Current active page (1-indexed)
 * @param {number} limit - Current items per page
 * @param {number} total - Total count of items in database
 * @param {function} onPageChange - Callback: (newPage, newLimit) => void
 */
const Pagination = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate range of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show page 1
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) {
        end = 4;
      } else if (page >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageClick = (p) => {
    if (p === 'ellipsis-start' || p === 'ellipsis-end' || p === page) return;
    onPageChange(p, limit);
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    onPageChange(1, newLimit);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-white rounded-b-[20px] text-[13px] font-sans">
      {/* Left side: Results Count Summary */}
      <div className="text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-800">{startItem}</span>–
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{total.toLocaleString()}</span> results
      </div>

      {/* Right side: Page selector + Limit dropdown */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Limit Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Per page</span>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-blue cursor-pointer transition-colors text-[13px]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1), limit)}
            disabled={page <= 1}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
            title="Previous Page"
          >
            <ChevronLeft size={15} />
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === 'ellipsis-start' || p === 'ellipsis-end') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                  &hellip;
                </span>
              );
            }

            const isActive = p === page;
            return (
              <button
                key={p}
                onClick={() => handlePageClick(p)}
                className={`w-9 h-9 flex items-center justify-center font-semibold rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#102a5c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1), limit)}
            disabled={page >= totalPages}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm bg-white"
            title="Next Page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
