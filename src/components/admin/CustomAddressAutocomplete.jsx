import React, { useState, useEffect, useRef } from 'react';

export const CustomAddressAutocomplete = ({ value, onChange, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const fetchAddresses = async (q) => {
    if (!q || q.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=25`);
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setShow(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAddresses(val);
    }, 500);
  };

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setShow(false);
    onSelect(item);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => { if (results.length > 0) setShow(true); }}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        placeholder="Start typing your street address..."
        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
        required
      />
      {loading && (
        <span className="absolute right-3.5 top-2.5 inline-block animate-spin rounded-full h-4 w-4 border-2 border-brand-blue border-t-transparent"></span>
      )}
      {show && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <div
              key={i}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(r); }}
              className="p-3 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
            >
              {r.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomAddressAutocomplete;
