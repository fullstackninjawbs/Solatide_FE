import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, options, onChange, placeholder = "Select an option", align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const alignmentClasses = align === 'right' 
    ? 'right-0 origin-top-right' 
    : 'left-0 origin-top-left';

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto min-w-[150px] flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[13.5px] font-medium focus:outline-none focus:border-brand-blue hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 w-[200px] bg-white border border-slate-200 rounded-[14px] shadow-lg py-1.5 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 ${alignmentClasses}`}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-[13.5px] flex items-center gap-2.5 hover:bg-slate-50 transition-colors ${value === option.value ? 'bg-slate-50/80 font-semibold text-brand-navy' : 'text-slate-650'}`}
            >
              <span className={`flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center ${value === option.value ? 'text-brand-navy' : 'text-transparent'}`}>
                {value === option.value && <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M11.6667 3.5L5.25001 9.91667L2.33334 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
