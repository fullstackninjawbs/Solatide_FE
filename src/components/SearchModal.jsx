import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Star } from 'lucide-react';
import productVialImage from '../assets/images/homePageFirstSection.png';
import { useCurrency } from '../context/CurrencyContext';
import { apiService } from '../services/api';

export const SearchModal = ({ onClose, navigate }) => {
  const [searchVal, setSearchVal] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const modalRef = useRef(null);
  const { formatPrice } = useCurrency();

  // 1) Fetch all products from backend on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await apiService.getProducts('limit=100');
        const result = await response.json();
        if (result.success && result.data && result.data.products) {
          setDbProducts(result.data.products);
          setSearchResults(result.data.products.slice(0, 4)); // Show first 4 by default
        }
      } catch (error) {
        console.warn('API query error inside search modal, using local fallback products.', error);
      }
    };
    fetchAllProducts();

    // Load recently viewed
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2) Handle search filtering
  useEffect(() => {
    if (dbProducts.length === 0) return;
    if (searchVal.trim() === '') {
      setSearchResults(dbProducts.slice(0, 4));
    } else {
      const filtered = dbProducts.filter((p) =>
        p.name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 4));
    }
  }, [searchVal, dbProducts]);

  // 3) Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 4) Close on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClearRecentlyViewed = (e) => {
    e.stopPropagation();
    localStorage.removeItem('recentlyViewed');
    setRecentlyViewed([]);
  };

  const handleProductClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  // Format price using global currency hook

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[1000] flex justify-center items-start pt-[12vh] px-4">
      <div
        ref={modalRef}
        className="w-full max-w-[800px] bg-[#f4f7fc] rounded-[28px] p-6 sm:p-7 flex flex-col gap-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative font-sans text-left border border-slate-100"
      >
        {/* Search Header Input bar */}
        <div className="relative flex items-center bg-white border border-slate-100 rounded-[20px] px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#1a4494]/10 transition-all duration-200 shadow-sm">
          <Search className="h-[18px] w-[18px] text-[#1a4494]/70 mr-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-[16px] text-slate-800 placeholder-slate-400 font-medium focus:ring-0 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Recently viewed products */}
        {recentlyViewed.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">
                Recently viewed
              </h4>
              <button
                onClick={handleClearRecentlyViewed}
                className="text-[13px] font-bold text-slate-500 hover:text-[#1a4494] transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((product) => (
                <div
                  key={product._id || product.id}
                  onClick={() => handleProductClick(product._id || product.id)}
                  className="group bg-white rounded-[20px] p-3 border border-slate-100 flex flex-col gap-2 cursor-pointer hover:shadow-md hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className={`relative w-full aspect-square ${product.imageUrl || product.image ? 'bg-white border border-slate-100/50' : 'bg-[#eef2f6]'} rounded-[14px] flex items-center justify-center overflow-hidden shrink-0`}>
                    <img
                      src={product.imageUrl || product.image || productVialImage}
                      className={product.imageUrl || product.image
                        ? 'object-contain w-full h-full p-2 select-none transition-transform duration-500 group-hover:scale-105'
                        : 'object-cover object-center scale-[1.7] translate-y-2.5 select-none transition-transform duration-500 group-hover:scale-[1.78]'
                      }
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-col text-left px-0.5">
                    <h5 className="text-[13px] font-bold text-slate-800 leading-tight line-clamp-2 h-[34px] tracking-tight">
                      {product.name}
                    </h5>
                    <span className="text-[12px] font-extrabold text-[#214A9E] mt-1.5 whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic products list section */}
        <div className="flex flex-col gap-3">
          <div className="px-1 text-left">
            <h4 className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">
              {searchVal.trim() === '' ? 'Products' : 'Search Results'}
            </h4>
          </div>
          {searchResults.length === 0 ? (
            <div className="w-full text-center py-10 bg-white rounded-2xl border border-slate-100 text-slate-400 font-semibold text-sm">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {searchResults.map((product) => (
                <div
                  key={product._id || product.id}
                  onClick={() => handleProductClick(product._id || product.id)}
                  className="group bg-white rounded-[20px] p-3 border border-slate-100 flex flex-col gap-2 cursor-pointer hover:shadow-md hover:border-slate-200/50 transition-all duration-300"
                >
                  <div className={`relative w-full aspect-square ${product.imageUrl || product.image ? 'bg-white border border-slate-100/50' : 'bg-[#eef2f6]'} rounded-[14px] flex items-center justify-center overflow-hidden shrink-0`}>
                    <img
                      src={product.imageUrl || product.image || productVialImage}
                      className={product.imageUrl || product.image
                        ? 'object-contain w-full h-full p-2 select-none transition-transform duration-500 group-hover:scale-105'
                        : 'object-cover object-center scale-[1.7] translate-y-2.5 select-none transition-transform duration-500 group-hover:scale-[1.78]'
                      }
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-col text-left px-0.5">
                    <h5 className="text-[13px] font-bold text-slate-800 leading-tight line-clamp-2 h-[34px] tracking-tight">
                      {product.name}
                    </h5>
                    <span className="text-[12px] font-extrabold text-[#214A9E] mt-1.5 whitespace-nowrap">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;
