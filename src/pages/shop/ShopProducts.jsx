import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import productVialImage from '../../assets/images/homePageFirstSection.webp';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { apiService } from '../../services/api';
const ShopProducts = ({ selectedCategory, setSelectedCategory }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { formatPrice } = useCurrency();
    const [availability, setAvailability] = useState('In Stock');
    const [sortBy, setSortBy] = useState('Best selling');
    const [viewMode, setViewMode] = useState('grid');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const dropdownRef = useRef(null);

    const sortOptions = [
        'Featured',
        'Most relevant',
        'Best selling',
        'Alphabetically, A-Z',
        'Alphabetically, Z-A',
        'Price, low to high',
        'Price, high to low',
        'Date, old to new',
        'Date, new to old'
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categories = [
        'All Products',
        'Metabolic Pathway Research',
        'Tissue & Cellular Research',
        'Dermal & Pigmentation Research',
        'Laboratory Support'
    ];

    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(productsList, "productsList--->");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const categorySlugMap = {
                    'Metabolic Pathway Research': 'metabolic-pathway',
                    'Tissue & Cellular Research': 'tissue-cellular',
                    'Dermal & Pigmentation Research': 'dermal-pigmentation',
                    'Laboratory Support': 'laboratory-support',
                    'All Products': 'All Products'
                };
                const mappedCategory = categorySlugMap[selectedCategory] || selectedCategory;
                const response = await apiService.getProducts(
                    `category=${encodeURIComponent(mappedCategory)}&availability=${encodeURIComponent(availability)}&sort=${encodeURIComponent(sortBy)}`
                );
                const result = await response.json();
                if (result.success && result.data && result.data.products) {
                    setProductsList(result.data.products);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, availability, sortBy]);

    return (
        <div className="main-container py-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Filters Sidebar */}
                <aside className="w-full lg:w-[340px] bg-white rounded-3xl p-6 border border-[#E8E8E8] shadow-sm shrink-0 text-left">
                    <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4 mb-6">
                        <h2 className="text-[17px] font-bold text-[#214A9E]">Filters</h2>
                        <button
                            onClick={() => {
                                setSelectedCategory('All Products');
                                setAvailability('In Stock');
                            }}
                            className="text-xs font-bold text-[#0ea5e9] hover:text-[#008bc7] transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Availability Filter */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-[#1E1E1E] mb-4 uppercase tracking-wider">Availability</h3>
                        <div className="space-y-2">
                            <label className={`flex items-center gap-3 cursor-pointer group text-[15px] rounded-xl px-4 py-3 transition-all border ${availability === 'In Stock' ? 'bg-[#F0F7FF] border-[#E0EFFE] text-[#214A9E] font-semibold' : 'border-transparent text-slate-700 font-medium hover:text-black'}`}>
                                <input
                                    type="radio"
                                    name="availability"
                                    checked={availability === 'In Stock'}
                                    onChange={() => setAvailability('In Stock')}
                                    className="sr-only"
                                />
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 ${availability === 'In Stock'
                                    ? 'border-2 border-[#214A9E] bg-white'
                                    : 'border border-slate-400 bg-white group-hover:border-slate-600'
                                    }`}>
                                    {availability === 'In Stock' && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#214A9E]" />
                                    )}
                                </div>
                                <span>In Stock</span>
                            </label>
                            <label className={`hidden items-center gap-3 cursor-pointer group text-[15px] rounded-xl px-4 py-3 transition-all border ${availability === 'Out of Stock' ? 'bg-[#F0F7FF] border-[#E0EFFE] text-[#214A9E] font-semibold' : 'border-transparent text-slate-700 font-medium hover:text-black'}`}>
                                <input
                                    type="radio"
                                    name="availability"
                                    checked={availability === 'Out of Stock'}
                                    onChange={() => setAvailability('Out of Stock')}
                                    className="sr-only"
                                />
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 ${availability === 'Out of Stock'
                                    ? 'border-2 border-[#214A9E] bg-white'
                                    : 'border border-slate-400 bg-white group-hover:border-slate-600'
                                    }`}>
                                    {availability === 'Out of Stock' && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#214A9E]" />
                                    )}
                                </div>
                                <span>Out of Stock</span>
                            </label>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1E1E1E] mb-4 uppercase tracking-wider">Category</h3>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <label key={category} className={`flex items-center gap-3 cursor-pointer group text-[15px] rounded-xl px-4 py-3 transition-all border ${selectedCategory === category ? 'bg-[#F0F7FF] border-[#E0EFFE] text-[#214A9E] font-semibold' : 'border-transparent text-slate-700 font-medium hover:text-black'}`}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === category}
                                        onChange={() => setSelectedCategory(category)}
                                        className="sr-only"
                                    />
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-all shrink-0 ${selectedCategory === category
                                        ? 'border-2 border-[#214A9E] bg-white'
                                        : 'border border-slate-400 bg-white group-hover:border-slate-600'
                                        }`}>
                                        {selectedCategory === category && (
                                            <div className="h-2.5 w-2.5 rounded-full bg-[#214A9E]" />
                                        )}
                                    </div>
                                    <span>{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Products Area */}
                <div className="flex-grow w-full">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <span className="text-[15px] text-[#1E1E1E]">
                                <span className="font-semibold">{productsList.length}</span> <span className="text-slate-500 font-normal">items</span>
                            </span>
                            {/* Active Filter Indicator */}
                            {selectedCategory !== 'All Products' && (
                                <div className="flex items-center gap-2 bg-[#EAF7FD] border border-[#00ADEE]/30 px-3 py-1.5 rounded-full">
                                    <span className="text-[13px] font-bold text-[#00ADEE]">{selectedCategory}</span>
                                    <button
                                        onClick={() => setSelectedCategory('All Products')}
                                        className="text-[#00ADEE] hover:text-[#008bc7] transition-colors focus:outline-none"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="bg-transparent px-2 py-1.5 text-[15px] font-bold text-[#1E1E1E] cursor-pointer flex items-center gap-1 focus:outline-none transition-all hover:opacity-85"
                                >
                                    <span>Sort</span>
                                    <svg
                                        className={`w-3.5 h-3.5 text-[#1E1E1E] transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>

                                {isSortOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#f8fafc] border border-[#E8E8E8] rounded-[16px] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSortBy(option);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-[14px] flex items-center transition-colors ${sortBy === option
                                                    ? 'text-[#214A9E] font-medium bg-[#eef2f6]/40'
                                                    : 'text-[#102a5c] font-normal hover:bg-slate-100/50'
                                                    }`}
                                            >
                                                {/* Checkmark */}
                                                <span className="w-5 inline-flex items-center justify-start shrink-0 text-[#214A9E] text-[15px] font-bold">
                                                    {sortBy === option ? '✓' : ''}
                                                </span>
                                                <span>{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grid / List Layout Selector Toggle */}
                            <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-sm shrink-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-[#e0eaf5] text-[#1a4494]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-[#e0eaf5] text-[#1a4494]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {productsList.length === 0 ? (
                        <div className="w-full text-center py-20 bg-white rounded-3xl border border-slate-200/50">
                            <p className="text-slate-400 font-semibold">No products match your filter criteria.</p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full"
                            : "flex flex-col gap-4 w-full"
                        }>
                            {productsList.map((product) => (
                                <div
                                    key={product._id || product.id}
                                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                                    className={`group bg-white rounded-[16px] sm:rounded-[24px] border border-slate-100 shadow-sm p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:border-slate-200/60 cursor-pointer ${viewMode === 'list' ? 'flex flex-row gap-4 sm:gap-6 items-center text-left' : 'flex flex-col'}`}
                                >
                                    {/* Product Vial Image */}
                                    <Link
                                        to={`/product/${product.id || product._id}`}
                                        className={`relative overflow-hidden ${product.imageUrl || product.image ? 'bg-white border border-slate-100/60' : 'bg-[#eef2f6]'} rounded-[14px] sm:rounded-[18px] flex items-center justify-center shrink-0 ${viewMode === 'list' ? 'w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]' : 'w-full h-[180px] sm:h-[280px] md:h-[300px] lg:h-[320px]'} block`}
                                    >
                                        <img
                                            src={product.imageUrl || product.image || productVialImage}
                                            className={product.imageUrl || product.image
                                                ? `object-contain w-full h-full p-2 sm:p-4 md:p-5 select-none transition-transform duration-500 group-hover:scale-105`
                                                : `object-cover object-center scale-[1.7] select-none transition-transform duration-500 group-hover:scale-[1.78] ${viewMode === 'list' ? 'translate-y-1' : 'translate-y-3'}`
                                            }
                                            alt={product.name}
                                        />

                                        {/* Badges */}
                                        {/* Badges — stacked vertically on mobile to avoid overlap */}
                                        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 z-10">
                                            {product.inStock && product.status !== 'Sale' && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#eaf7ee] to-[#f0fdf4] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-[#16a34a] border border-[#16a34a]/20 shadow-sm whitespace-nowrap">
                                                    <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-[#16a34a] animate-pulse shrink-0"></div>
                                                    In Stock
                                                </span>
                                            )}
                                            {!product.inStock && (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#fef2f2] to-[#fff5f5] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-red-600 border border-red-200 shadow-sm whitespace-nowrap">
                                                    <div className="w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 rounded-full bg-red-600 shrink-0"></div>
                                                    Sold Out
                                                </span>
                                            )}
                                            {product.inStock && product.status === 'Sale' && (
                                                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-amber-700 border border-amber-200 shadow-sm whitespace-nowrap">
                                                    Sale
                                                </span>
                                            )}
                                        </div>

                                        <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 inline-flex items-center gap-0.5 sm:gap-1 rounded-md bg-[#fef3c7]/90 backdrop-blur-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-extrabold text-[#92400e] border border-[#f59e0b]/30 shadow-sm z-10">
                                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#f59e0b] stroke-[#f59e0b]" />
                                            <span>{(product.ratingCount > 0 || product.reviewsCount > 0) ? product.rating : '0'}</span>
                                        </span>
                                    </Link>

                                    {/* Info */}
                                    <div className={`flex flex-col flex-grow text-left ${viewMode === 'list' ? '' : 'mt-3 sm:mt-4'}`}>
                                        <h3 className="text-[13px] sm:text-[18px] font-weight-500 font-medium text-[#1E1E1E] tracking-tight leading-snug line-clamp-2">
                                            <Link to={`/product/${product.id || product._id}`} className="hover:text-[#00bfef] transition-colors">
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center justify-between mt-2 sm:mt-auto pt-2">
                                            <span className="text-[15px] sm:text-[20px] font-weight-600 font-semibold text-[#00E5FF]">
                                                {formatPrice(product.price)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product, 1);
                                                }}
                                                className={`h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-[#edf4ff] text-[#214A9E] flex items-center justify-center hover:bg-[#214A9E] hover:text-white transition-all duration-300 cursor-pointer focus:outline-none shadow-sm shrink-0 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopProducts;
