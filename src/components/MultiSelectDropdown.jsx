import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

const MultiSelectDropdown = ({ options, value = [], onChange, placeholder = "Select options..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (e, optionValue) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));
  
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className="min-h-[42px] w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap gap-1.5 items-center cursor-pointer focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-slate-500 text-[14px] px-1">{placeholder}</span>
        ) : (
          selectedOptions.map(opt => (
            <span key={opt.value} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[12px] font-medium">
              <span className="max-w-[150px] truncate">{opt.label}</span>
              <X className="w-3 h-3 hover:text-blue-900 cursor-pointer" onClick={(e) => removeOption(e, opt.value)} />
            </span>
          ))
        )}
        <div className="ml-auto text-slate-400">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 flex flex-col py-1">
          <div className="px-3 pb-2 pt-1 sticky top-0 bg-white z-10 border-b border-slate-100">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
            ) : (
              filteredOptions.map(opt => {
                const isSelected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-[14px] ${isSelected ? 'font-semibold text-blue-900' : 'text-slate-700'}`}>
                      {opt.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
