import React from 'react';
import ShopBanner from '../pages/shop/ShopBanner';
import ProductCategories from '../pages/shop/ProductCategories';
import ShopProducts from '../pages/shop/ShopProducts';

const Shop = () => {
    return (
        <div className="w-full bg-[#f8fafc] min-h-screen">
            <ShopBanner />
            <ShopProducts />
            <ProductCategories />
        </div>
    );
};

export default Shop;
