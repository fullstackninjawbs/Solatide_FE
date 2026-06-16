import React, { useState } from 'react';
import ShopBanner from './ShopBanner';
import productVialImage from '../../assets/homePageFirstSection.png';

const Shop = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [availability, setAvailability] = useState('In Stock');
    const [sortBy, setSortBy] = useState('Best Selling');
    const [viewMode, setViewMode] = useState('grid');

    const products = [
        {
            id: 1,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true,
            category: 'Metabolic Pathway Research',
            status: 'In Stock'
        },
        {
            id: 2,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: false,
            category: 'Tissue & Cellular Research',
            status: 'Sold Out'
        },
        {
            id: 3,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true,
            category: 'Dermal & Pigmentation Research',
            status: 'Sale'
        },
        {
            id: 4,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true,
            category: 'Metabolic Pathway Research',
            status: 'In Stock'
        },
        {
            id: 5,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true,
            category: 'Tissue & Cellular Research',
            status: 'In Stock'
        },
        {
            id: 6,
            name: 'Bacteriostatic Water 10mL',
            price: 'Rs. 1,400.00',
            rating: '5.0',
            inStock: true,
            category: 'Dermal & Pigmentation Research',
            status: 'In Stock'
        }
    ];

    const categories = [
        'All Products',
        'Metabolic Pathway Research',
        'Tissue & Cellular Research',
        'Dermal & Pigmentation Research'
    ];

    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All Products' || product.category === selectedCategory;
        const stockMatch = availability === 'All' || 
            (availability === 'In Stock' && product.inStock) || 
            (availability === 'Out of Stock' && !product.inStock);
        return categoryMatch && stockMatch;
    });

    return (
        <div className="w-full bg-[#f8fafc] min-h-screen">
            {/* Shop Page Hero Banner */}
            <ShopBanner />

            {/* Main Content Layout */}
            <div className="main-container py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-[280px] bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm shrink-0 text-left">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-[17px] font-bold text-slate-800">Filters</h2>
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
                            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Availability</h3>
                            <div className="space-y-3.5">
                                <label className="flex items-center gap-3 cursor-pointer group text-[14px] font-medium text-slate-600 hover:text-slate-900">
                                    <input 
                                        type="radio" 
                                        name="availability"
                                        checked={availability === 'In Stock'}
                                        onChange={() => setAvailability('In Stock')}
                                        className="h-4.5 w-4.5 text-[#0ea5e9] focus:ring-[#0ea5e9]/20 border-slate-300"
                                    />
                                    <span>In Stock</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group text-[14px] font-medium text-slate-600 hover:text-slate-900">
                                    <input 
                                        type="radio" 
                                        name="availability"
                                        checked={availability === 'Out of Stock'}
                                        onChange={() => setAvailability('Out of Stock')}
                                        className="h-4.5 w-4.5 text-[#0ea5e9] focus:ring-[#0ea5e9]/20 border-slate-300"
                                    />
                                    <span>Out of Stock</span>
                                </label>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Category</h3>
                            <div className="space-y-3.5">
                                {categories.map(category => (
                                    <label key={category} className="flex items-center gap-3 cursor-pointer group text-[14px] font-medium text-slate-600 hover:text-slate-900">
                                        <input 
                                            type="radio" 
                                            name="category"
                                            checked={selectedCategory === category}
                                            onChange={() => setSelectedCategory(category)}
                                            className="h-4.5 w-4.5 text-[#0ea5e9] focus:ring-[#0ea5e9]/20 border-slate-300"
                                        />
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
                            <span className="text-[14px] font-bold text-slate-500">
                                <span className="text-slate-800">{filteredProducts.length}</span> products
                            </span>

                            <div className="flex items-center gap-3">
                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <select 
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-slate-200/80 rounded-full px-5 py-2 pr-10 text-[13px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/10 focus:border-[#0ea5e9] transition-all"
                                    >
                                        <option value="Best Selling">Best Selling</option>
                                        <option value="Price: Low to High">Price: Low to High</option>
                                        <option value="Price: High to Low">Price: High to Low</option>
                                        <option value="Newest">Newest</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
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
                        {filteredProducts.length === 0 ? (
                            <div className="w-full text-center py-20 bg-white rounded-3xl border border-slate-200/50">
                                <p className="text-slate-400 font-semibold">No products match your filter criteria.</p>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full" 
                                : "flex flex-col gap-4 w-full"
                            }>
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`group bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:border-slate-200/60 ${viewMode === 'list' ? 'flex flex-row gap-6 items-center text-left' : 'flex flex-col'}`}
                                    >
                                        {/* Product Vial Image */}
                                        <div className={`relative overflow-hidden bg-[#eef2f6] rounded-[18px] flex items-center justify-center border border-slate-100/50 shrink-0 ${viewMode === 'list' ? 'w-[120px] h-[120px]' : 'w-full h-[240px]'}`}>
                                            <img
                                                src={productVialImage}
                                                className={`object-cover object-center scale-[1.7] select-none transition-transform duration-500 group-hover:scale-[1.78] ${viewMode === 'list' ? 'translate-y-1' : 'translate-y-3'}`}
                                                alt={product.name}
                                            />

                                            {/* Badges */}
                                            {product.status === 'In Stock' && (
                                                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[#eaf7ee] px-2.5 py-0.5 text-[9px] font-bold text-[#16a34a] border border-[#16a34a]/10">
                                                    In Stock
                                                </span>
                                            )}
                                            {product.status === 'Sold Out' && (
                                                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[#fef2f2] px-2.5 py-0.5 text-[9px] font-bold text-red-600 border border-red-200">
                                                    Sold Out
                                                </span>
                                            )}
                                            {product.status === 'Sale' && (
                                                <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-[#fef3c7] px-2.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                                                    Sale
                                                </span>
                                            )}

                                            <span className="absolute top-3 right-3 inline-flex items-center rounded-md bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-extrabold text-[#d97706] shadow-sm">
                                                ★ {product.rating}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className={`flex flex-col flex-grow text-left ${viewMode === 'list' ? '' : 'mt-4'}`}>
                                            <span className="text-[11px] font-extrabold text-[#0ea5e9] tracking-wider uppercase mb-1">
                                                {product.category}
                                            </span>
                                            <h3 className="text-[15px] sm:text-base font-bold text-slate-800 tracking-tight leading-snug">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mt-3.5">
                                                <span className="text-base sm:text-lg font-extrabold text-[#1a4494]">
                                                    {product.price}
                                                </span>
                                                <button className={`h-9 w-9 rounded-full bg-[#e0eaf5]/85 text-[#1a4494] flex items-center justify-center hover:bg-[#e0eaf5] transition-all cursor-pointer focus:outline-none ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
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
        </div>
    );
};

export default Shop;
