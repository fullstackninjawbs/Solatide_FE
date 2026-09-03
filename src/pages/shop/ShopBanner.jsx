import React from 'react';

const ShopBanner = () => {
    return (
        <section className="w-full pt-6 pb-6 md:py-10 border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-[36px] md:text-[48px] font-bold text-[#214A9E] leading-[1.1] tracking-tight capitalize mt-4 md:mt-0">
                    Shop All Products
                </h1>
                <p className="text-[#6A6A6A] text-[15px] md:text-[16px] font-medium leading-relaxed max-w-2xl">
                    Browse our complete catalogue of research compounds and peptides.
                </p>
                <p className="text-[#6A6A6A] text-[15px] md:text-[16px] font-medium leading-relaxed max-w-2xl">
                    New to research peptides?{' '}
                    <a href="/peptides-guide" className="text-[#0ea5e9] hover:underline font-medium">
                        Research Peptides Guide
                    </a>
                </p>
            </div>
        </section>
    );
};

export default ShopBanner;
