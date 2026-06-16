import React from 'react';

const ShopBanner = () => {
    return (
        <div className="w-full bg-[#f1f6fc] py-16 text-center border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#102a5c] tracking-tight mb-4 text-center">
                    Shop All Products
                </h1>
                <p className="text-slate-600 text-[15px] md:text-base font-medium max-w-2xl mx-auto mb-2 leading-relaxed text-center">
                    Browse our complete catalogue of research compounds and peptides.
                </p>
                <p className="text-slate-500 text-sm font-semibold text-center">
                    New to research peptides?{' '}
                    <a href="#" className="text-[#0ea5e9] hover:underline">
                        Research Peptides Guide
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ShopBanner;
