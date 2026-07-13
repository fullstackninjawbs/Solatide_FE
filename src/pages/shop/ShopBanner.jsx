import React from 'react';

const ShopBanner = () => {
    return (
        <div className="w-full pt-12 text-center">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
                <h1 className="text-[48px] font-bold text-[#214A9E] leading-[100%] tracking-normal text-center capitalize">
                    Shop All Products
                </h1>
                <p className="text-[#6A6A6A] text-[16px] font-normal leading-[100%] tracking-normal text-center">
                    Browse our complete catalogue of research compounds and peptides.
                </p>
                <p className="text-[#6A6A6A] text-[16px] font-normal leading-[100%] tracking-normal text-center">
                    New to research peptides?{' '}
                    <a href="#" className="text-[#0ea5e9] hover:underline font-normal text-[16px]">
                        Research Peptides Guide
                    </a>
                </p>




            </div>

        </div>
    );
};

export default ShopBanner;
