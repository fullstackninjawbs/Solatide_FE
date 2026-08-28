import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-slate-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4 tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-[15px] md:text-[16px] text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-6 py-3 bg-[#102a5c] text-white rounded-full font-semibold hover:bg-[#1a4185] transition-colors duration-300 shadow-sm hover:shadow-md"
        >
          <Home size={18} />
          Back to Homepage
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-colors duration-300 shadow-sm"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
